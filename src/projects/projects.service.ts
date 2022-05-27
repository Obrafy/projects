import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientGrpc } from '@nestjs/microservices';
import { Project, ProjectDocument } from './entities/project.entity';
import { Address, AddressDocument } from './entities/address.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { UserManagementServiceClient, USER_MANAGEMENT_SERVICE_NAME } from 'src/common/dto/proto/auth.pb';
import { firstValueFrom } from 'rxjs';
import * as DTO from '../projects/dto/project.dto';
import { PROJECT_ERROR_MESSAGES_KEYS } from 'src/common/error-messages/error-messagens.interface';
import { Status } from 'src/common/dto/status.enum';
import * as EXCEPTIONS from '@nestjs/common/exceptions';

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
  ) { }

  // Private Methods

  /**
   * Get an user by id
   * @param projectId The Project's id
   * @returns The response Project object
   */
  private async _getProjectById(projectId: string): Promise<ProjectDocument> {
    return this.projectModel.findOne({ _id: projectId, status: { $ne: Status.DELETED } });
  }


  public onModuleInit(): void {
    this.userManagementServiceClient =
      this.grpcClient.getService<UserManagementServiceClient>(USER_MANAGEMENT_SERVICE_NAME);
  }

  private readonly logger = new Logger(ProjectsService.name);

  public async create(createProjectDto: DTO.ProjectCreateRequestDto): Promise<ProjectDocument> {
    this.logger.log('Creating new project');

    const { address, tasks } = createProjectDto;

    const allTasks = tasks.map(async (task) => {
      const { laborers } = task;

      laborers.map(async (userId) => {
        const { error } = await firstValueFrom(
          this.userManagementServiceClient.findUserById({ userId }));
        if (error && error.length > 0) throw new NotFoundException(error);
      });

      const taskCreated = await this.tasksService.create(task);

      return {
        task: taskCreated.id,
        laborers: task.laborers
      };
    });

    const tasksCreated = await Promise.all(allTasks);
    await this.addressModel.create(address);

    return await this.projectModel.create({
      ...createProjectDto,
      tasks: tasksCreated,
    });

  }

  public async findAll(): Promise<ProjectDocument[]> {
    this.logger.log('Find all Projects');
    const projectsData = await this.projectModel.find().exec();
    return projectsData
  }

  public async findOne({ id }: DTO.ProjectFindOneRequestDto): Promise<ProjectDocument> {
    this.logger.log('Find one  by id', id);
    const project = await this._getProjectById(id)

    if (!project) throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);

    return project
  }

  public async update({ id, data }: DTO.ProjectUpdateRequestDto): Promise<ProjectDocument> {
    await this.projectModel.findOneAndUpdate({ _id: id }, data);

    const project = await this._getProjectById(id)
    if (!project) throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);

    return project;
  }

  public async remove({ id }: DTO.ProjectRemoveRequestDto) {
    this.logger.log('Remove Project by ID', id);

    const project = await this._getProjectById(id)
    if (!project) throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);

    project.status = Status.DELETED;

    await project.save()
  }

  public async findAllTaskOfProject({
    id,
  }: DTO.FindAllTaskOfProjectRequestDto) {


    this.logger.log('Find Tasks one project by id', id);

    const project = await (
      await this.projectModel.findOne({ _id: id }, { tasks: 1 })
    ).populate({
      path: 'tasks.task',
    });

    if (!project) throw new EXCEPTIONS.NotFoundException(PROJECT_ERROR_MESSAGES_KEYS.PROJECT_NOT_FOUND);


    return project;
  }

  public async fieldsOverrides({
    projectId,
    taskId,
    data,
  }: DTO.FieldsOverridesRequestDto): Promise<ProjectDocument> {

    this.logger.log('Make fields Overrides', data);


    const project = await this._getProjectById(projectId)

    const projectTask = project.tasks.find((task) => task === taskId)
    projectTask.fieldsOverrides = data
    return project.save()

    // return project
  }
}
