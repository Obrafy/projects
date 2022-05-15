import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateProjectRequest,
  FindOneProjectRequest,
  RemoveProjectRequest,
  FindAllTaskOfProjectRequest,
} from './dto/project.dto';
import { Project, ProjectDocument } from './entities/project.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Address, AddressDocument } from './entities/address.entity';
import { TasksService } from 'src/tasks/tasks.service';
import {
  FindAllResponse,
  FindAllTaskOfProjectResponse,
  FindOneResponse,
  ProjectCreateResponse,
  RemoveResponse,
  UpdateResponse,
} from './dto/proto/project.pb';

@Injectable()
export class ProjectsService {
  constructor(
    private tasksService: TasksService,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) {}

  private readonly logger = new Logger(ProjectsService.name);

  public async create(
    createProjectDto: CreateProjectRequest,
  ): Promise<ProjectCreateResponse> {
    this.logger.log('Creating new project');

    const { address, tasks } = createProjectDto;

    const tasksCreated = await Promise.all(
      tasks.map(async (task) => {
        const taskCreated = await this.tasksService.create(task);
        return { task: taskCreated._id };
      }),
    );

    const project = new this.projectModel({
      ...createProjectDto,
      tasks: tasksCreated,
    });

    const addressOfProject = new this.addressModel(address);
    addressOfProject.save();
    project.save();

    return { status: HttpStatus.CREATED, error: null };
  }

  public async findAll(): Promise<FindAllResponse> {
    this.logger.log('Find all Projects');
    const queryResult = await this.projectModel.find().exec();

    const result = queryResult.map((project: ProjectDocument) => {
      return {
        status: project.status,
        startDate: new Date(project.startDate).getTime(),
        expectedFinishedDate: new Date(project.startDate).getTime(),
        responsible: project.responsible,
        address: project.address,
        /** repeated ProjectTasks tasks = 7; */
        id: project._id,
      };
    });

    return { status: HttpStatus.OK, error: null, data: result };
  }

  public async findOne({
    id,
  }: FindOneProjectRequest): Promise<FindOneResponse> {
    this.logger.log('Find one  by id', id);
    const project = await this.projectModel.findOne({ _id: id });

    if (!project) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Not found',
        data: undefined,
      };
    }

    const result = {
      status: project.status,
      startDate: new Date(project.startDate).getTime(),
      expectedFinishedDate: new Date(project.startDate).getTime(),
      responsible: project.responsible,
      address: project.address,
      /** repeated ProjectTasks tasks = 7; */
      id: project._id,
    };
    return { status: HttpStatus.OK, error: null, data: result };
  }

  public async update({ id, payload }): Promise<UpdateResponse> {
    await this.projectModel.findOneAndUpdate({ _id: id }, payload);
    const project = await this.projectModel.findById({ _id: id });

    if (!project) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Not found',
        data: undefined,
      };
    }

    const result = {
      status: project.status,
      startDate: new Date(project.startDate).getTime(),
      expectedFinishedDate: new Date(project.startDate).getTime(),
      responsible: project.responsible,
      address: project.address,
      /** repeated ProjectTasks tasks = 7; */
      id: project._id,
    };

    return { status: HttpStatus.OK, error: null, data: result };
  }

  public async remove({ id }: RemoveProjectRequest): Promise<RemoveResponse> {
    this.logger.log('Remove Project by ID', id);
    await this.projectModel.findOneAndDelete({ _id: id });

    return { status: HttpStatus.OK, error: null };
  }

  public async findAllTaskOfProject({
    id,
  }: FindAllTaskOfProjectRequest): Promise<FindAllTaskOfProjectResponse> {
    this.logger.log('Find Tasks one project by id', id);
    const project = await (
      await this.projectModel.findOne({ _id: id }, { tasks: 1 })
    ).populate({
      path: 'tasks.task',
    });

    if (!project) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Not found',
        data: undefined,
      };
    }

    const result = project.tasks.map((item) => {
      return {
        category: item.task.category,
        activity: item.task.activity,
        noiseLevel: item.task.noiseLevel,
        messLevel: item.task.messLevel,
      };
    });

    return { status: HttpStatus.OK, error: null, data: result };
  }
}
