import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';

@Injectable()
export class TasksService {

  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) { }

  private readonly logger = new Logger(TasksService.name);

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    this.logger.log('Creating new task');
    // TODO - find Skill by id before create Task
    const task = new this.taskModel(createTaskDto)
    task.save()
    return task
  }

  async findAll() {
    this.logger.log('Find all Tasks');
    return this.taskModel.find().exec()
  }

  async findOne(id: string) {
    this.logger.log('Find task by id', id);
    const task = await this.taskModel.findOne({ _id: id })
    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.taskModel.findOneAndUpdate({ _id: id }, updateTaskDto).exec()
  }

  async remove(id: string) {
    this.logger.log('Remove Task by ID', id);
    await this.taskModel.findOneAndDelete({ _id: id })
  }
}
