import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import makeResponse from '../common/helpers/make-response';
import * as PROTO from '../common/dto/proto/project.pb';
import { ProjectsService } from './projects.service';
import {
  FieldsOverridesDataDto,
  FieldsOverridesRequestDto,
  FindAllTaskOfProjectRequestDto,
  ProjectCreateRequestDto,
  ProjectFindOneRequestDto,
  ProjectRemoveRequestDto,
  ProjectUpdateRequestDto,
} from './dto/project.dto';

@Controller()
export class ProjectsController {
  @Inject(ProjectsService)
  private readonly projectsService: ProjectsService;

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'create')
  private async create(
    createProjectDto: ProjectCreateRequestDto,
  ): Promise<PROTO.ProjectCreateResponse> {
    const projectData = await this.projectsService.create(createProjectDto);

    return makeResponse<PROTO.ProjectCreateResponse>({
      project: {
        status: projectData.status,
        startDate: new Date(projectData.startDate).getTime(),
        expectedFinishedDate: new Date(projectData.expectedFinishedDate).getTime(),
        responsible: projectData.responsible,
        address: projectData.address,
        projectTask: [],
        id: projectData._id,
      }
    });
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'findAll')
  private async findAll(): Promise<PROTO.ProjectFindAllResponse> {
    const projects = await this.projectsService.findAll();

    const result = projects.map(projectData => {
      return {
        project: {
          status: projectData.status,
          startDate: new Date(projectData.startDate).getTime(),
          expectedFinishedDate: new Date(projectData.expectedFinishedDate).getTime(),
          responsible: projectData.responsible,
          address: projectData.address,
          projectTask: [],
          id: projectData._id,
        }
      }
    })

    return makeResponse<PROTO.ProjectFindAllResponse>(result);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'findOne')
  private async findOne(
    payload: ProjectFindOneRequestDto,
  ): Promise<PROTO.ProjectFindOneResponse> {
    const projectData = await this.projectsService.findOne(payload);

    return makeResponse<PROTO.ProjectFindOneResponse>({
      project: {
        projectTask: [],
        status: projectData.status,
        startDate: new Date(projectData.startDate).getTime(),
        expectedFinishedDate: new Date(projectData.expectedFinishedDate).getTime(),
        responsible: projectData.responsible,
        address: projectData.address,
        id: projectData._id,
      }
    });
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'update')
  private async update({
    id,
    data,
  }: ProjectUpdateRequestDto): Promise<PROTO.ProjectUpdateResponse> {
    const projectData = await this.projectsService.update({
      id,
      data: data as PROTO.UpdateProjectData,
    });

    return makeResponse<PROTO.ProjectUpdateResponse>({
      project: {
        status: projectData.status,
        startDate: new Date(projectData.startDate).getTime(),
        expectedFinishedDate: new Date(projectData.expectedFinishedDate).getTime(),
        responsible: projectData.responsible,
        address: projectData.address,
        id: projectData._id,
        projectTask: []
      }
    });
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'remove')
  private async remove(
    payload: ProjectRemoveRequestDto,
  ): Promise<PROTO.ProjectRemoveResponse> {
    await this.projectsService.remove(payload);

    return makeResponse<PROTO.ProjectRemoveResponse>(null);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'findAllTaskOfProject')
  private async findAllTaskOfProject(
    payload: FindAllTaskOfProjectRequestDto,
  ): Promise<PROTO.FindAllTaskOfProjectResponse> {
    const taskProjectData = await this.projectsService.findAllTaskOfProject(payload);

    const result = taskProjectData.tasks.map(item => {
      const { task } = item

      return {
        category: task.category,
        activity: task.activity,
        noiseLevel: task.noiseLevel,
        dirtLevel: task.dirtLevel,
        description: task.description,
        unity: task.unity,
        possibleSkills: task.possibleSkills
      };
    })



    return makeResponse<PROTO.FindAllTaskOfProjectResponse>(result);
  }

  @GrpcMethod(PROTO.PROJECT_SERVICE_NAME, 'fieldsOverrides')
  private async fieldsOverrides({
    projectId,
    taskId,
    data,
  }: FieldsOverridesRequestDto): Promise<PROTO.FieldsOverridesResponse> {
    const taskProjectData = await this.projectsService.fieldsOverrides({
      projectId,
      taskId,
      data: data as FieldsOverridesDataDto,
    });

    const task = taskProjectData.tasks[0].task

    const result = {
      category: task.category,
      activity: task.activity,
      noiseLevel: task.noiseLevel,
      dirtLevel: task.dirtLevel,
      description: task.description,
      unity: task.unity,
      possibleSkills: task.possibleSkills
    };

    return makeResponse<PROTO.FieldsOverridesResponse>(result);

  }
}
