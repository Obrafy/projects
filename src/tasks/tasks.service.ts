import { Model, FilterQuery } from 'mongoose';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PossibleSkills, Task, TaskDocument } from './entities/task.entity';
import * as DTO from '../tasks/dto/task.dto';
import { SkillManagementServiceClient, SKILL_MANAGEMENT_SERVICE_NAME } from 'src/common/dto/proto/auth.pb';
import { TASK_ERROR_MESSAGES_KEYS } from 'src/common/error-messages/error-messagens.interface';
import * as EXCEPTIONS from '@nestjs/common/exceptions';
import { Status } from 'src/common/dto/status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @Inject(SKILL_MANAGEMENT_SERVICE_NAME)
    private readonly grpcClient: ClientGrpc,
  ) {}

  // Private Methods

  /**
   * Get an user by id
   * @param projectId The Project's id
   * @returns The response Project object
   */
  private async _getTaskById(taskId: string): Promise<TaskDocument> {
    return this.taskModel.findOne({
      _id: taskId,
      status: { $ne: Status.DELETED },
    });
  }

  /**
   * Get all tasks
   * @returns An array of tasks objects
   */
  private async _getAllTasks(filter: FilterQuery<TaskDocument> = {}): Promise<TaskDocument[]> {
    return this.taskModel.find({ status: { $ne: Status.DELETED }, ...filter });
  }

  private skillManagementServiceClient: SkillManagementServiceClient;

  public onModuleInit(): void {
    this.skillManagementServiceClient =
      this.grpcClient.getService<SkillManagementServiceClient>(SKILL_MANAGEMENT_SERVICE_NAME);
  }

  private readonly logger = new Logger(TasksService.name);

  public async create(createTaskDto: DTO.TaskCreateRequestDto): Promise<TaskDocument> {
    this.logger.log('Creating new task');

    const taskObj = await this.taskModel.findOne({ ...createTaskDto });

    if (taskObj) {
      throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_ALREADY_EXISTS);
    }

    return await this.taskModel.create(createTaskDto);
  }

  public async findAll(): Promise<TaskDocument[]> {
    this.logger.log(this.findAll.name);
    return await this._getAllTasks();
  }

  public async findOne({ id }: DTO.TaskFindOneRequestDto): Promise<TaskDocument> {
    this.logger.log('Find task by id', id);

    const task = await this._getTaskById(id);

    if (!task) throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND);

    return task;
  }

  public async update({ id, data }: DTO.TaskUpdateRequestDto): Promise<TaskDocument> {
    await this.taskModel.findOneAndUpdate({ _id: id }, data).exec();

    const task = await this._getTaskById(id);
    if (!task) throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND);

    return task;
  }

  public async remove({ id }: DTO.TaskRemoveRequestDto) {
    this.logger.log('Remove Task by ID', id);

    const task = await this._getTaskById(id);
    if (!task) throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND);

    task.status = Status.DELETED;

    await task.save();
  }

  public async changeTaskStatus(payload: DTO.TaskStatusRequestDto, status: Status): Promise<void> {
    this.logger.log(this.changeTaskStatus.name, payload);
    const task = await this._getTaskById(payload.taskId);

    if (!task) {
      throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND);
    }

    task.status = status;

    await task.save();
  }

  public async addSkillToTask(payload: DTO.AddSkillToTaskRequestDto): Promise<void> {
    this.logger.log(this.addSkillToTask.name, payload);

    const task = await this._getTaskById(payload.taskId);

    if (!task) {
      throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_NOT_FOUND);
    }

    const { skillsIds } = payload;

    const hasSkillAlreadyAssigned = task.possibleSkills.filter((skill) => skillsIds.indexOf(skill.skillId) === -1);

    if (hasSkillAlreadyAssigned.length > 0) {
      throw new EXCEPTIONS.NotFoundException(TASK_ERROR_MESSAGES_KEYS.TASK_SKILL_ALREADY_ASSIGNED);
    }

    const possibleSkills = skillsIds.map((skillId) => {
      return new PossibleSkills(skillId, 0);
    });

    task.possibleSkills = [...task.possibleSkills, ...possibleSkills];

    await task.save();
  }
}
