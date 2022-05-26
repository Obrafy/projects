import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import * as PROTO from '../common/dto/proto/project.pb';
import {
  TaskCreateRequestDto,
  TaskFindOneRequestDto,
  TaskRemoveRequestDto,
  TaskUpdateRequestDto,
} from './dto/task.dto';
import makeResponse from 'src/common/helpers/make-response';
@Controller()
export class TasksController {
  @Inject(TasksService)
  private readonly tasksService: TasksService;

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'create')
  private async create(
    createTaskDto: TaskCreateRequestDto,
  ): Promise<PROTO.TaskCreateResponse> {
    const taskData = await this.tasksService.create(createTaskDto);

    return makeResponse<PROTO.TaskCreateResponse>({
      task: {
        category: taskData.category,
        activity: taskData.activity,
        noiseLevel: taskData.noiseLevel,
        dirtLevel: taskData.dirtLevel,
        description: taskData.description,
        unity: taskData.unity,
        possibleSkills: taskData.possibleSkills,
        status: taskData.status
      }
    })

  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'findAll')
  private async findAll(): Promise<PROTO.TaskFindAllResponse> {
    const tasksData = await this.tasksService.findAll();

    const result = tasksData.map(task => {
      return {
        task: {
          category: task.category,
          activity: task.activity,
          noiseLevel: task.noiseLevel,
          dirtLevel: task.dirtLevel,
          description: task.description,
          unity: task.unity,
          possibleSkills: task.possibleSkills,
          status: task.status
        }
      }
    })

    return makeResponse<PROTO.TaskFindAllResponse>(result)

  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'findOne')
  private async findOne(
    payload: TaskFindOneRequestDto,
  ): Promise<PROTO.TaskFindOneResponse> {
    const taskData = await this.tasksService.findOne(payload);

    return makeResponse<PROTO.TaskFindOneResponse>({
      task: {
        category: taskData.category,
        activity: taskData.activity,
        noiseLevel: taskData.noiseLevel,
        dirtLevel: taskData.dirtLevel,
        description: taskData.description,
        unity: taskData.unity,
        possibleSkills: taskData.possibleSkills,
        status: taskData.status,
      }
    })
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'update')
  private async update({
    id,
    data,
  }: TaskUpdateRequestDto): Promise<PROTO.TaskUpdateResponse> {
    const taskData = await this.tasksService.update({
      id,
      data: data as PROTO.TaskUpdateData,
    });

    return makeResponse<PROTO.TaskFindOneResponse>({
      task: {
        category: taskData.category,
        activity: taskData.activity,
        noiseLevel: taskData.noiseLevel,
        dirtLevel: taskData.dirtLevel,
        description: taskData.description,
        unity: taskData.unity,
        possibleSkills: taskData.possibleSkills,
        status: taskData.status
      }
    })
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'remove')
  private async remove(
    payload: TaskRemoveRequestDto,
  ): Promise<PROTO.TaskRemoveResponse> {
    await this.tasksService.remove(payload);

    return makeResponse<PROTO.TaskRemoveResponse>(null)
  }
}