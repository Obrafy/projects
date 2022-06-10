import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientGrpc } from '@nestjs/microservices';
import { Project, ProjectDocument } from './entities/project.entity';
import { Address, AddressDocument } from './entities/address.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { UserManagementServiceClient, USER_MANAGEMENT_SERVICE_NAME } from 'src/common/dto/proto/auth.pb';
import * as DTO from '../projects/dto/project.dto';
import {
  PROJECT_ERROR_MESSAGES_KEYS,
  TASK_ERROR_MESSAGES_KEYS,
} from 'src/common/error-messages/error-messagens.interface';
import { Status } from 'src/common/dto/status.enum';
import * as EXCEPTIONS from '@nestjs/common/exceptions';
import { ProjectTasks } from './entities/projectTasks.entity';
import { TaskDocument } from 'src/tasks/entities/task.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectsService {
  private userManagementServiceClient: UserManagementServiceClient;

  constructor(
    private tasksService: TasksService,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,

    @Inject(USER_MANAGEMENT_SERVICE_NAME)
    private readonly grpcClient: ClientGrpc,
  ) {}

  // Private Methods

  /**
   * Get an user by id
   * @param projectId The Project's id
   * @returns The response Project object
   */
  private async _getProjectById(projectId: string): Promise<ProjectDocument> {
    return this.projectModel.findOne({
      _id: projectId,
      status: { $ne: Status.DELETED },
    });
  }

  /**
   * Get all projects
   * @returns An array of projects objects
   */
  private async _getAllProjects(filter: FilterQuery<ProjectDocument> = {}): Promise<ProjectDocument[]> {
    return this.projectModel.find({ status: { $ne: Status.DELETED }, ...filter }).populate(['address', 'tasks.task']);
  }

  public onModuleInit(): void {
    this.userManagementServiceClient =
      this.grpcClient.getService<UserManagementServiceClient>(USER_MANAGEMENT_SERVICE_NAME);
  }

  private readonly logger = new Logger(ProjectsService.name);

  public async create(createProjectDto: DTO.ProjectCreateRequestDto): Promise<ProjectDocument> {
    this.logger.log('Creating new project');

    try {
      const { address, tasks } = createProjectDto;

      if (tasks) {
        await Promise.all(tasks.map((taskId) => this.tasksService.findOne({ taskId })));
      }

      let addressObj = await this.addressModel.findOne({ ...address });

      if (!addressObj) {
        addressObj = await this.addressModel.create(address);
      }

      console.log(createProjectDto.startDate, new Date(createProjectDto.startDate));

      return await this.projectModel.create({
        ...createProjectDto,
        address: addressObj,
      });
    } catch (err) {
      console.error({ err });
    }
  }

  public async findAll(): Promise<ProjectDocument[]> {
    this.logger.log(this.findAll.name);
    return await this._getAllProjects();
  }

  public async findOne({ projectId }: DTO.ProjectFindOneRequestDto): Promise<ProjectDocument> {
    this.logger.log('Find one  by id', projectId);
    const project = await this._getProjectById(projectId);

    if (!project) throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);

    return project;
  }

  public async update({ projectId, data }: DTO.ProjectUpdateRequestDto): Promise<ProjectDocument> {
    await this.projectModel.findOneAndUpdate({ _id: projectId }, data);

    const project = await this._getProjectById(projectId);
    if (!project) throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);

    return project;
  }

  public async remove({ projectId }: DTO.ProjectRemoveRequestDto) {
    this.logger.log('Remove Project by ID', projectId);

    const project = await this._getProjectById(projectId);
    if (!project) throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);

    project.status = Status.DELETED;

    await project.save();
  }

  public async findAllTaskOfProject({ projectId }: DTO.FindAllTaskOfProjectRequestDto) {
    this.logger.log('Find Tasks one project by id', projectId);

    const project = await this.projectModel.findOne({ _id: projectId }, { tasks: 1 });

    if (!project) throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);

    return project;
  }

  public async fieldsOverrides({ projectId, taskId, data }: DTO.FieldsOverridesRequestDto): Promise<ProjectDocument> {
    this.logger.log('Make fields Overrides', data);

    const project = await this._getProjectById(projectId);

    const projectTask = project.tasks.find(({ task }) => (task as TaskDocument)._id === taskId);
    projectTask.fieldsOverrides = data;
    return project.save();
  }

  public async changeProjectStatus(payload: DTO.ProjectStatusRequestDto, status: Status): Promise<void> {
    this.logger.log(this.changeProjectStatus.name, payload);
    const project = await this._getProjectById(payload.projectId);

    if (!project) {
      throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);
    }

    project.status = status;

    await project.save();
  }

  public async addTasksToProject(payload: DTO.AddTasksToProjectRequestDto): Promise<void> {
    this.logger.log(this.addTasksToProject.name, payload);
    const { tasks } = payload;

    const project = await this._getProjectById(payload.projectId);

    if (!project) {
      throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);
    }

    const hasTaskAlreadyAssigned = project.tasks.filter(
      (projectTask) =>
        tasks.findIndex((t) => {
          if (typeof projectTask.task === 'string') {
            return projectTask.task === t.tasksIds;
          }

          return (projectTask.task as TaskDocument)._id === t.tasksIds;
        }) === -1,
    );

    if (hasTaskAlreadyAssigned.length > 0) {
      throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_TASK_ALREADY_ASSIGNED);
    }

    const projectTasks = await Promise.all(
      tasks.map(async ({ tasksIds: taskId, effort, durationInWorkDays }) => {
        const task = await this.tasksService.findOne({ taskId });
        return new ProjectTasks({
          task,
          durationInWorkDays: Number(durationInWorkDays),
          effort,
          laborers: [],
          fieldsOverrides: {},
        });
      }),
    );

    project.tasks = [...project.tasks, ...projectTasks];

    await project.save();
  }

  public async removeTasksToProject(payload: DTO.RemoveTasksToProjectRequestDto): Promise<void> {
    this.logger.log(this.removeTasksToProject.name, payload);
    const { tasksIds } = payload;

    const project = await this._getProjectById(payload.projectId);

    if (!project) {
      throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);
    }

    const tasksFiltered = project.tasks.filter((item) => {
      return tasksIds.indexOf((item.task as TaskDocument)._id) === -1;
    });

    project.tasks = tasksFiltered;

    await project.save();
  }

  public async addLaborersToProject(payload: DTO.AddLaborersToProjectRequestDto): Promise<void> {
    this.logger.log(this.addLaborersToProject.name, payload);
    const { projectId, laborers, taskId } = payload;

    const project = await this._getProjectById(projectId);

    if (!project) {
      throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);
    }

    const projectTaskIndex = project.tasks.findIndex((projectTask) => {
      return (projectTask.task as TaskDocument)._id.toString() === taskId;
    });

    if (projectTaskIndex === -1)
      throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND_IN_PROJECT);

    const validLaborers = await Promise.all(
      laborers.map(async (userId) => {
        const { error, status } = await firstValueFrom(this.userManagementServiceClient.findUserById({ userId }));
        if (error && error.length > 0) throw new EXCEPTIONS.HttpException(error, status);
        return userId;
      }),
    );

    project.tasks[projectTaskIndex].laborers = validLaborers;
    project.markModified('tasks');
    await project.save();
  }

  public async removeLaborersToProject(payload: DTO.RemoveLaborersToProjectRequestDto): Promise<void> {
    this.logger.log(this.removeLaborersToProject.name, payload);
    const { projectId, laborers, taskId } = payload;

    const project = await this._getProjectById(projectId);

    if (!project) {
      throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);
    }

    const projectTaskIndex = project.tasks.findIndex((projectTask) => {
      return (projectTask.task as TaskDocument)._id.toString() === taskId;
    });

    if (projectTaskIndex === -1)
      throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND_IN_PROJECT);

    const laborersFiltered = project.tasks[projectTaskIndex].laborers.filter((userId) => {
      return laborers.indexOf(userId) === -1;
    });

    project.tasks[projectTaskIndex].laborers = laborersFiltered;
    project.markModified('tasks');
    await project.save();
  }
}
