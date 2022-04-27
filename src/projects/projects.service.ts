
import { Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';


import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Address, AddressDocument } from './entities/address.entity';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class ProjectsService {

  constructor(
    private tasksService: TasksService,
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Address.name) private readonly addressModel: Model<AddressDocument>,
  ) { }

  private readonly logger = new Logger(ProjectsService.name);

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    this.logger.log('Creating new project');
    const { address, tasks } = createProjectDto

    const tasksCreated = await Promise.all(tasks.map(async (task) => {
      const taskCreated = await this.tasksService.create(task)
      return taskCreated._id
    }));

    const project = new this.projectModel({
      ...createProjectDto,
      ["tasks.task"]: tasksCreated,
    });

    const addressOfProject = new this.addressModel(address);
    addressOfProject.save()
    project.save()
    return project
  }

  async findAll(): Promise<Project[]> {
    this.logger.log('Find all Projects');
    return this.projectModel.find().exec()
  }

  async findOne(id: string): Promise<Project> {
    this.logger.log('Find one  by id', id);
    const project = await (await this.projectModel.findOne({ _id: id })).populate("tasks.task")
    return project
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    return this.projectModel.findOneAndUpdate({ _id: id }, updateProjectDto)
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Remove Project by ID', id);
    await this.projectModel.findOneAndDelete({ _id: id })
  }


  async findAllTaskOfProject(id: string): Promise<Project> {
    this.logger.log('Find Tasks one project by id', id);
    const tasks = await (await this.projectModel
      .findOne({ _id: id }, { "tasks": 1 }))
      .populate({
        path: 'tasks.task',
      })
    return tasks
  }

}


