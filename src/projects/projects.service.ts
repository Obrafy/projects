
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

    const valueTaks = tasks.map(async (task) => {
      const value = await this.tasksService.create(task)
      this.logger.log('Creating new project');
      console.log(value._id)
      return value._id
    })

    // createProjectDto.tasks = valueTaks

    // this.logger.log('Creating new taks', valueTaks);
    const project = new this.projectModel(createProjectDto);
    const addressOfProject = new this.addressModel(address);
    project.save()
    addressOfProject.save()
    return project
  }

  async findAll(): Promise<Project[]> {
    this.logger.log('Find all Projects');
    return this.projectModel.find().exec()
  }

  async findOne(id: string): Promise<Project> {
    this.logger.log('Find one  by id', id);
    const project = await this.projectModel.findOne({ _id: id })
    return project
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    return this.projectModel.findOneAndUpdate({ _id: id }, updateProjectDto)
  }

  async remove(id: string): Promise<void> {
    this.logger.log('Remove Project by ID', id);
    await this.projectModel.findOneAndDelete({ _id: id })
  }
}


