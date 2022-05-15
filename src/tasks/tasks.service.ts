import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskDocument } from './entities/task.entity';
import {
  CreateResponse,
  FindAllResponse,
  FindOneResponse,
  RemoveResponse,
  UpdateResponse,
} from './dto/proto/task.pb';
import { FindOneTaskRequest, RemoveTaskRequest } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  public async create(createTaskDto: CreateTaskDto): Promise<CreateResponse> {
    this.logger.log('Creating new task');

    // TODO - find Skill by id before create Task
    const task = new this.taskModel(createTaskDto);
    task.save();

    const result = {
      category: task.category,
      activity: task.activity,
      noiseLevel: task.noiseLevel,
      messLevel: task.messLevel,
      possibleSkills: task.possibleSkills,
      id: task._id,
    };

    return { status: HttpStatus.OK, error: null, data: result };
  }

  public async findAll(): Promise<FindAllResponse> {
    this.logger.log('Find all Tasks');

    const queryResult = await this.taskModel.find().exec();

    const result = queryResult.map((task) => {
      return {
        category: task.category,
        activity: task.activity,
        noiseLevel: task.noiseLevel,
        messLevel: task.messLevel,
        possibleSkills: task.possibleSkills,
        id: task._id,
      };
    });

    return { status: HttpStatus.OK, error: null, data: result };
  }

  public async findOne({ id }: FindOneTaskRequest): Promise<FindOneResponse> {
    this.logger.log('Find task by id', id);

    const task = await this.taskModel.findOne({ _id: id });

    if (!task) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Not found',
        data: undefined,
      };
    }

    const result = {
      category: task.category,
      activity: task.activity,
      noiseLevel: task.noiseLevel,
      messLevel: task.messLevel,
      possibleSkills: task.possibleSkills,
      id: task._id,
    };

    return { status: HttpStatus.OK, error: null, data: result };
  }

  public async update({ id, payload }): Promise<UpdateResponse> {
    await this.taskModel.findOneAndUpdate({ _id: id }, payload).exec();
    const task = await this.taskModel.findById({ _id: id });

    if (!task) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Not found',
        data: undefined,
      };
    }

    const result = {
      category: task.category,
      activity: task.activity,
      noiseLevel: task.noiseLevel,
      messLevel: task.messLevel,
      possibleSkills: task.possibleSkills,
      id: task._id,
    };

    return { status: HttpStatus.OK, error: null, data: result };
  }

  public async remove({ id }: RemoveTaskRequest): Promise<RemoveResponse> {
    this.logger.log('Remove Task by ID', id);
    await this.taskModel.findOneAndDelete({ _id: id });

    return { status: HttpStatus.OK, error: null };
  }
}
