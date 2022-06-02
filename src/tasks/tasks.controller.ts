import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import * as PROTO from '../common/dto/proto/project.pb';
import * as DTO from './dto/task.dto';
import makeResponse from 'src/common/helpers/make-response';
import { Status } from 'src/common/dto/status.enum';
@Controller()
export class TasksController {
  @Inject(TasksService)
  private readonly tasksService: TasksService;

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'Create')
  private async create(createTaskDto: DTO.TaskCreateRequestDto): Promise<PROTO.TaskCreateResponse> {
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
        status: taskData.status,
      },
    });
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'FindAll')
  private async findAll(): Promise<PROTO.TaskFindAllResponse> {
    const tasksData = await this.tasksService.findAll();

    const result = tasksData.map((task) => {
      return {
        task: {
          category: task.category,
          activity: task.activity,
          noiseLevel: task.noiseLevel,
          dirtLevel: task.dirtLevel,
          description: task.description,
          unity: task.unity,
          possibleSkills: task.possibleSkills,
          status: task.status,
        },
      };
    });

    return makeResponse<PROTO.TaskFindAllResponse>(result);
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'FindOne')
  private async findOne(payload: DTO.TaskFindOneRequestDto): Promise<PROTO.TaskFindOneResponse> {
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
      },
    });
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'Update')
  private async update({ taskId, data }: DTO.TaskUpdateRequestDto): Promise<PROTO.TaskUpdateResponse> {
    const taskData = await this.tasksService.update({
      taskId,
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
        status: taskData.status,
      },
    });
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'Remove')
  private async remove(payload: DTO.TaskRemoveRequestDto): Promise<PROTO.TaskRemoveResponse> {
    await this.tasksService.remove(payload);

    return makeResponse<PROTO.TaskRemoveResponse>(null);
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'ActivateTask')
  private async activateTask(payload: DTO.TaskStatusRequestDto): Promise<PROTO.ActivateTaskResponse> {
    await this.tasksService.changeTaskStatus(payload, Status.ACTIVE);
    return makeResponse<PROTO.ActivateTaskResponse>(null);
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'DeactivateTask')
  private async deactivateTask(payload: DTO.TaskStatusRequestDto): Promise<PROTO.DeactivateTaskResponse> {
    await this.tasksService.changeTaskStatus(payload, Status.INACTIVE);
    return makeResponse<PROTO.DeactivateTaskResponse>(null);
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'AddSkillToTask')
  private async addSkillToTask(payload: DTO.AddSkillToTaskRequestDto): Promise<PROTO.AddSkillToTaskResponse> {
    await this.tasksService.addSkillToTask(payload);
    return makeResponse<PROTO.AddSkillToTaskResponse>(null);
  }

  @GrpcMethod(PROTO.TASK_SERVICE_NAME, 'RemoveSkillToTask')
  private async removeSkillToTask(payload: DTO.RemoveSkillToTaskRequestDto): Promise<PROTO.RemoveSkillToTaskResponse> {
    await this.tasksService.removeSkillToTask(payload);
    return makeResponse<PROTO.RemoveSkillToTaskResponse>(null);
  }
}
