import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateResponse,
  FindAllResponse,
  FindOneResponse,
  TASK_SERVICE_NAME,
  UpdateResponse,
} from './dto/proto/task.pb';
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
  private async create(createTaskDto: CreateTaskDto): Promise<CreateResponse> {
    const result = await this.tasksService.create(createTaskDto);
    return { status: HttpStatus.OK, error: null, data: result };
  }
  '';

  @GrpcMethod(TASK_SERVICE_NAME, 'findAll')
  private async findAll(): Promise<FindAllResponse> {
    const result = await this.tasksService.findAll();
    return { status: HttpStatus.OK, error: null, data: result };
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'findOne')
  private async findOne(payload: FindOneTaskRequest): Promise<FindOneResponse> {
    const result = await this.tasksService.findOne(payload);
    return { status: HttpStatus.OK, error: null, data: result };
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'update')
  private async update({ id, data }: UpdateRequest): Promise<UpdateResponse> {
    const result = await this.tasksService.update({
      id,
      payload: data as UpdateTaskDto,
    });

    return { status: HttpStatus.OK, error: null, data: result };
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'remove')
  private async remove(payload: RemoveTaskRequest) {
    await this.tasksService.remove(payload);

    return { status: HttpStatus.OK, error: null };
  }
}
