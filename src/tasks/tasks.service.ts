import { Model } from 'mongoose';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Task, TaskDocument } from './entities/task.entity';
import * as DTO from '../tasks/dto/task.dto';
import { firstValueFrom } from 'rxjs';
import { SkillManagementServiceClient, SKILL_MANAGEMENT_SERVICE_NAME } from 'src/common/dto/proto/auth.pb';
import { TASK_ERROR_MESSAGES_KEYS } from 'src/common/error-messages/error-messagens.interface';
import * as EXCEPTIONS from '@nestjs/common/exceptions';
import { Status } from 'src/common/dto/status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @Inject(SKILL_MANAGEMENT_SERVICE_NAME) private readonly grpcClient: ClientGrpc,
  ) { }

  // Private Methods

  /**
   * Get an user by id
   * @param projectId The Project's id
   * @returns The response Project object
   */
  private async _getTaskById(taskId: string): Promise<TaskDocument> {
    return this.taskModel.findOne({ _id: taskId });
  }

  private skillManagementServiceClient: SkillManagementServiceClient;

  public onModuleInit(): void {
    this.skillManagementServiceClient =
      this.grpcClient.getService<SkillManagementServiceClient>(SKILL_MANAGEMENT_SERVICE_NAME);
  }

  private readonly logger = new Logger(TasksService.name);

  public async create(createTaskDto: DTO.TaskCreateRequestDto): Promise<TaskDocument> {
    this.logger.log('Creating new task');

    const checkSkillPromises = createTaskDto.possibleSkills.map(async (skill) => {
      const skillId: string = skill.skillId;
      const { error } = await firstValueFrom(this.skillManagementServiceClient.findSkillById({ skillId }))
      if (error && error.length > 0) throw new EXCEPTIONS.NotFoundException(error);
    });

    await Promise.all(checkSkillPromises);

    return await this.taskModel.create(createTaskDto);
  }

  public async findAll(): Promise<TaskDocument[]> {
    this.logger.log('Find all Tasks');

    const tasks = await this.taskModel.find().exec();

    return tasks
  }

  public async findOne({ id }: DTO.TaskFindOneRequestDto): Promise<TaskDocument> {
    this.logger.log('Find task by id', id);

    const task = await this._getTaskById(id)

    if (!task) throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND);

    return task;
  }

  public async update({ id, data }: DTO.TaskUpdateRequestDto): Promise<TaskDocument> {
    await this.taskModel.findOneAndUpdate({ _id: id }, data).exec();

    const task = await this._getTaskById(id)
    if (!task) throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND);

    return task;
  }

  public async remove({ id }: DTO.TaskRemoveRequestDto) {
    this.logger.log('Remove Task by ID', id);

    const task = await this._getTaskById(id)
    if (!task) throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND);

    task.status = Status.DELETED;

    await task.save()
  }

}
