import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskDocument } from './entities/task.entity';
import { FindOneTaskRequest, RemoveTaskRequest } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  public async create(createTaskDto: CreateTaskDto) {
    this.logger.log('Creating new task');

    // TODO - find Skill by id before create Task
    const task = await this.taskModel.create(createTaskDto);
    const result = this.MakeTaskResponse(task);
    return result;
  }

  public async findAll() {
    this.logger.log('Find all Tasks');

    const queryResult = await this.taskModel.find().exec();

    const result = queryResult.map((task) => this.MakeTaskResponse(task));
    return result;
  }

  public async findOne({ id }: FindOneTaskRequest) {
    this.logger.log('Find task by id', id);

    const task = await this.taskModel.findOne({ _id: id });

    if (!task) {
      throw new NotFoundException();
    }

    const result = this.MakeTaskResponse(task);
    return result;
  }

  public async update({ id, payload }) {
    await this.taskModel.findOneAndUpdate({ _id: id }, payload).exec();
    const task = await this.taskModel.findById({ _id: id });

    if (!task) {
      throw new NotFoundException();
    }

    const result = this.MakeTaskResponse(task);
    return result;
  }

  public async remove({ id }: RemoveTaskRequest) {
    this.logger.log('Remove Task by ID', id);
    await this.taskModel.findOneAndDelete({ _id: id });
  }

  private MakeTaskResponse(
    task: Task & import('mongoose').Document<any, any, any> & { _id: any },
  ) {
    return {
      category: task.category,
      activity: task.activity,
      noiseLevel: task.noiseLevel,
      dirtLevel: task.dirtLevel,
      possibleSkills: task.possibleSkills,
      description: task.description,
      unity: task.unity,
      id: task._id,
    };
  }
}
