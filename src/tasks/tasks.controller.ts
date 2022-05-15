import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FindAllResponse, TASK_SERVICE_NAME } from './dto/proto/task.pb';
import { TasksService } from './tasks.service';

import {
  FindOneTaskRequest,
  RemoveTaskRequest,
  UpdateRequest,
} from './dto/task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller()
export class TasksController {
  @Inject(TasksService)
  private readonly tasksService: TasksService;

  @GrpcMethod(TASK_SERVICE_NAME, 'create')
  private create(createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'findAll')
  private findAll(): Promise<FindAllResponse> {
    return this.tasksService.findAll();
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'findOne')
  private findOne(payload: FindOneTaskRequest) {
    return this.tasksService.findOne(payload);
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'update')
  private update({ id, data }: UpdateRequest) {
    return this.tasksService.update({
      id,
      payload: data as UpdateTaskDto,
    });
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'remove')
  private remove(payload: RemoveTaskRequest) {
    return this.tasksService.remove(payload);
  }
}
