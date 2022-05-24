import { Controller, HttpStatus, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { makeResponse } from 'src/common/service/makeResponse';
import {
  CreateProjectRequest,
  FieldsOverridesRequest,
  FindAllTaskOfProjectRequest,
  FindOneProjectRequest,
  RemoveProjectRequest,
  UpdateRequest,
} from './dto/project.dto';
import {
  FindAllResponse,
  FindAllTaskOfProjectResponse,
  FindOneResponse,
  ProjectCreateResponse,
  PROJECT_SERVICE_NAME,
  RemoveResponse,
  UpdateResponse,
} from './dto/proto/project.pb';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller()
export class ProjectsController {
  @Inject(ProjectsService)
  private readonly projectsService: ProjectsService;

  @GrpcMethod(PROJECT_SERVICE_NAME, 'create')
  private create(
    createProjectDto: CreateProjectRequest,
  ): Promise<ProjectCreateResponse> {
    return this.projectsService.create(createProjectDto);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'findAll')
  private async findAll(): Promise<FindAllResponse> {
    const result = await this.projectsService.findAll();
    return makeResponse(HttpStatus.OK, null, result);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'findOne')
  private async findOne(
    payload: FindOneProjectRequest,
  ): Promise<FindOneResponse> {
    const result = await this.projectsService.findOne(payload);
    return makeResponse(HttpStatus.OK, null, result);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'update')
  private async update({ id, data }: UpdateRequest): Promise<UpdateResponse> {
    const result = await this.projectsService.update({
      id,
      payload: data as UpdateProjectDto,
    });
    return makeResponse(HttpStatus.OK, null, result);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'remove')
  private async remove(payload: RemoveProjectRequest): Promise<RemoveResponse> {
    await this.projectsService.remove(payload);
    return makeResponse(HttpStatus.OK, null, null);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'findAllTaskOfProject')
  private async findAllTaskOfProject(
    payload: FindAllTaskOfProjectRequest,
  ): Promise<FindAllTaskOfProjectResponse> {
    const result = await this.projectsService.findAllTaskOfProject(payload);
    return makeResponse(HttpStatus.OK, null, result);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'fieldsOverrides')
  private async fieldsOverrides({
    projectId,
    taskId,
    data,
  }: FieldsOverridesRequest): Promise<FindAllTaskOfProjectResponse> {
    const result = await this.projectsService.fieldsOverrides({
      projectId,
      taskId,
      payload: data,
    });
    return makeResponse(HttpStatus.OK, null, result);
  }
}
