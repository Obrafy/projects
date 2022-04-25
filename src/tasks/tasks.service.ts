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

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.log('Creating new task');
    const task = new this.taskModel(createTaskDto)
    task.save()
    return task
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
