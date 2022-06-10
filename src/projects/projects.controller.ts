import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import makeResponse from '../common/helpers/make-response';
import { ProjectsService } from './projects.service';
import * as DTO from './dto/project.dto';
import * as PROTO from '../common/dto/proto/project.pb';
import { Status } from 'src/common/dto/status.enum';

@Controller()
export class ProjectsController {
  @Inject(ProjectsService)
  private readonly projectsService: ProjectsService;

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'Create')
  private async create(createProjectDto: DTO.ProjectCreateRequestDto): Promise<PROTO.ProjectCreateResponse> {
    const projectData = await this.projectsService.create(createProjectDto);

    return makeResponse<PROTO.ProjectCreateResponse>({
      project: {
        status: projectData.status,
        startDate: projectData.startDate.getTime(),
        expectedFinishedDate: projectData.expectedFinishedDate.getTime(),
        responsible: projectData.responsible,
        address: projectData.address,
        projectTask: [],
        id: projectData._id,
      },
    });
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'FindAll')
  private async findAll(): Promise<PROTO.ProjectFindAllResponse> {
    const projects = await this.projectsService.findAll();

    const result = projects.map((projectData) => {
      return {
        status: projectData.status,
        startDate: projectData.startDate.getTime(),
        expectedFinishedDate: projectData.expectedFinishedDate.getTime(),
        responsible: projectData.responsible,
        address: projectData.address,
        projectTask: projectData.tasks.map((t) => ({
          ...t,
          task: t.task._id,
        })),
        id: projectData._id,
      };
    });

    return makeResponse<PROTO.ProjectFindAllResponse>(result);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'FindOne')
  private async findOne(payload: DTO.ProjectFindOneRequestDto): Promise<PROTO.ProjectFindOneResponse> {
    const projectData = await this.projectsService.findOne(payload);

    return makeResponse<PROTO.ProjectFindOneResponse>({
      project: {
        projectTask: [],
        status: projectData.status,
        startDate: projectData.startDate.getTime(),
        expectedFinishedDate: projectData.expectedFinishedDate.getTime(),
        responsible: projectData.responsible,
        address: projectData.address,
        id: projectData._id,
      },
    });
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'ActivateProject')
  private async activateProject(payload: DTO.ProjectStatusRequestDto): Promise<PROTO.ActivateProjectResponse> {
    await this.projectsService.changeProjectStatus(payload, Status.ACTIVE);
    return makeResponse<PROTO.ActivateProjectResponse>(null);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'DeactivateProject')
  private async deactivateProject(payload: DTO.ProjectStatusRequestDto): Promise<PROTO.DeactivateProjectResponse> {
    await this.projectsService.changeProjectStatus(payload, Status.INACTIVE);
    return makeResponse<PROTO.DeactivateProjectResponse>(null);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'Update')
  private async update({ projectId, data }: DTO.ProjectUpdateRequestDto): Promise<PROTO.ProjectUpdateResponse> {
    const projectData = await this.projectsService.update({
      projectId,
      data: data as PROTO.UpdateProjectData,
    });

    return makeResponse<PROTO.ProjectUpdateResponse>({
      project: {
        status: projectData.status,
        startDate: projectData.startDate.getTime(),
        expectedFinishedDate: projectData.expectedFinishedDate.getTime(),
        responsible: projectData.responsible,
        address: projectData.address,
        id: projectData._id,
        projectTask: [],
      },
    });
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'Remove')
  private async remove(payload: DTO.ProjectRemoveRequestDto): Promise<PROTO.ProjectRemoveResponse> {
    await this.projectsService.remove(payload);

    return makeResponse<PROTO.ProjectRemoveResponse>(null);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'FindAllTaskOfProject')
  private async findAllTaskOfProject(
    payload: DTO.FindAllTaskOfProjectRequestDto,
  ): Promise<PROTO.FindAllTaskOfProjectResponse> {
    const taskProjectData = await this.projectsService.findAllTaskOfProject(payload);

    const result = taskProjectData.tasks.map((projectTask) => ({
      ...projectTask,
      task: projectTask.task._id,
    }));

    return makeResponse<PROTO.FindAllTaskOfProjectResponse>(result);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'FieldsOverrides')
  private async fieldsOverrides({
    projectId,
    taskId,
    data,
  }: DTO.FieldsOverridesRequestDto): Promise<PROTO.FieldsOverridesResponse> {
    const taskProjectData = await this.projectsService.fieldsOverrides({
      projectId,
      taskId,
      data: data as DTO.FieldsOverridesDataDto,
    });

    const task = taskProjectData.tasks[0].task;

    const result = {
      category: task.category,
      activity: task.activity,
      noiseLevel: task.noiseLevel,
      dirtLevel: task.dirtLevel,
      description: task.description,
      unity: task.unity,
      possibleSkills: task.possibleSkills,
    };

    return makeResponse<PROTO.FieldsOverridesResponse>(result);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'AddTasksToProject')
  private async addTasksToProject(payload: DTO.AddTasksToProjectRequestDto): Promise<PROTO.AddTasksToProjectResponse> {
    await this.projectsService.addTasksToProject(payload);
    return makeResponse<PROTO.AddTasksToProjectResponse>(null, { httpStatus: HttpStatus.NO_CONTENT });
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'RemoveTasksToProject')
  private async removeTasksToProject(
    payload: DTO.RemoveTasksToProjectRequestDto,
  ): Promise<PROTO.RemoveTasksToProjectResponse> {
    await this.projectsService.removeTasksToProject(payload);
    return makeResponse<PROTO.RemoveTasksToProjectResponse>(null);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'AddLaborersToProject')
  private async AddLaborersToProject(
    payload: DTO.AddLaborersToProjectRequestDto,
  ): Promise<PROTO.AddLaborersToProjectResponse> {
    await this.projectsService.addLaborersToProject(payload);
    return makeResponse<PROTO.AddLaborersToProjectResponse>(null);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'RemoveLaborersToProject')
  private async RemoveLaborersToProject(
    payload: DTO.RemoveLaborersToProjectRequestDto,
  ): Promise<PROTO.RemoveLaborersToProjectResponse> {
    await this.projectsService.removeLaborersToProject(payload);
    return makeResponse<PROTO.RemoveLaborersToProjectResponse>(null);
  }
}
