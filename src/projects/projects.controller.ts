import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import {
  CreateProjectRequest,
  FindAllTaskOfProjectRequest,
  FindOneProjectRequest,
  RemoveProjectRequest,
  UpdateRequest,
} from './dto/project.dto';
import { FindAllResponse, PROJECT_SERVICE_NAME } from './dto/proto/project.pb';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller()
export class ProjectsController {
  @Inject(ProjectsService)
  private readonly projectsService: ProjectsService;

  @GrpcMethod(PROJECT_SERVICE_NAME, 'create')
  private create(createProjectDto: CreateProjectRequest) {
    return this.projectsService.create(createProjectDto);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'findAll')
  private findAll(): Promise<FindAllResponse> {
    return this.projectsService.findAll();
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'findOne')
  private findOne(payload: FindOneProjectRequest) {
    return this.projectsService.findOne(payload);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'update')
  private update({ id, data }: UpdateRequest) {
    return this.projectsService.update({
      id,
      payload: data as UpdateProjectDto,
    });
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'remove')
  private remove(payload: RemoveProjectRequest) {
    return this.projectsService.remove(payload);
  }

  @GrpcMethod(PROJECT_SERVICE_NAME, 'findAllTaskOfProject')
  private findAllTaskOfProject(payload: FindAllTaskOfProjectRequest) {
    return this.projectsService.findAllTaskOfProject(payload);
  }
}
