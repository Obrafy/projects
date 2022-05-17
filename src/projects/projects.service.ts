import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class ProjectsService {
  constructor(
    private tasksService: TasksService,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) { }

  private readonly logger = new Logger(ProjectsService.name);

  public async create(
    createProjectDto: CreateProjectRequest,
  ) {
    this.logger.log('Creating new project');

    const { address, tasks } = createProjectDto;

    const tasksCreated = await Promise.all(
      tasks.map(async (task) => {
        const taskCreated = await this.tasksService.create(task);
        return { task: taskCreated.id };
      }),
    );

    await this.projectModel.create({
      ...createProjectDto,
      tasks: tasksCreated,
    });

    await this.addressModel.create(address);


    return { status: HttpStatus.CREATED, error: null };
  }

  public async findAll() {
    this.logger.log('Find all Projects');
    const queryResult = await this.projectModel.find().exec();

    const result = queryResult.map((project) => this.MakeProjectResponse(project))
    return result
  }

  public async findOne({
    id,
  }: FindOneProjectRequest) {
    this.logger.log('Find one  by id', id);
    const project = await this.projectModel.findOne({ _id: id });

    if (!project) {
      throw new NotFoundException()
    }

    const result = this.MakeProjectResponse(project);
    return result
  }

  public async update({ id, payload }) {
    await this.projectModel.findOneAndUpdate({ _id: id }, payload);
    const project = await this.projectModel.findById({ _id: id });

    if (!project) {
      throw new NotFoundException()
    }

    const result = this.MakeProjectResponse(project);
    return result
  }

  public async remove({ id }: RemoveProjectRequest) {
    this.logger.log('Remove Project by ID', id);
    await this.projectModel.findOneAndDelete({ _id: id });
  }

  public async findAllTaskOfProject({
    id,
  }: FindAllTaskOfProjectRequest) {
    this.logger.log('Find Tasks one project by id', id);
    const project = await (
      await this.projectModel.findOne({ _id: id }, { tasks: 1 })
    ).populate({
      path: 'tasks.task',
    });

    if (!project) {
      throw new NotFoundException()
    }

    const result = project.tasks.map((item) => {
      return {
        category: item.task.category,
        activity: item.task.activity,
        noiseLevel: item.task.noiseLevel,
        messLevel: item.task.messLevel,
      };
    });

    return result
  }

  private MakeProjectResponse(project: Project & import("mongoose").Document<any, any, any> & { _id: any; }) {
    return {
      status: project.status,
      startDate: new Date(project.startDate).getTime(),
      expectedFinishedDate: new Date(project.startDate).getTime(),
      responsible: project.responsible,
      address: project.address,
      /** repeated ProjectTasks tasks = 7; */
      id: project._id,
    };
  }
}
