import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested, IsEnum, IsOptional, IsMongoId, IsNumber } from 'class-validator';

import { Address } from './address.dto';
import * as PROTO from '../../common/dto/proto/project.pb';
import { PartialBy } from 'src/common/types/global';

export class ProjectCreateRequestDto implements PartialBy<PROTO.ProjectCreateRequest, 'tasks'> {
  @IsNumber()
  startDate: number;

  @IsNumber()
  expectedFinishedDate: number;

  @IsString()
  responsible: string;

  @Type(() => Address)
  @ValidateNested()
  @IsNotEmpty()
  address: Address;

  @IsMongoId({ each: true })
  @IsOptional()
  tasks?: string[];
}

export class ProjectFindAllRequestDto implements PROTO.ProjectFindAllRequest {}

export class ProjectFindOneRequestDto implements PROTO.ProjectFindOneRequest {
  @IsString()
  public readonly projectId: string;
}

export class UpdateProjectDataDto implements PROTO.UpdateProjectData {
  expectedFinishedDate?: number;
  startDate?: number;
  status?: PROTO.Status;

  @IsString()
  responsible?: string;
}

export class ProjectUpdateRequestDto implements PROTO.ProjectUpdateRequest {
  @IsString()
  public readonly projectId: string;

  @Type(() => UpdateProjectDataDto)
  @ValidateNested()
  data: UpdateProjectDataDto;
}

export class ProjectRemoveRequestDto implements PROTO.ProjectRemoveRequest {
  @IsString()
  public readonly projectId: string;
}

export class FindAllTaskOfProjectRequestDto implements PROTO.FindAllTaskOfProjectRequest {
  @IsString()
  public readonly projectId: string;
}

enum LevelType {
  'LOW' = 'LOW',
  'HIGH' = 'HIGH',
}

enum UnityType {
  'VB' = 'VB',
  'M2' = 'M²',
  'UNID' = 'UNID',
}

export class FieldsOverridesDataDto implements PROTO.FieldsOverrides {
  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  activity: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(LevelType)
  @IsOptional()
  noiseLevel: LevelType;

  @IsEnum(LevelType)
  @IsOptional()
  dirtLevel: LevelType;

  @IsEnum(UnityType)
  @IsOptional()
  unity: UnityType;

  @IsNumber()
  @IsOptional()
  priority: number; 
}

export class FieldsOverridesRequestDto implements PROTO.FieldsOverridesRequest {
  @IsString()
  public readonly projectId: string;

  @IsString()
  public readonly taskId: string;

  @Type(() => FieldsOverridesDataDto)
  @ValidateNested()
  @IsNotEmpty()
  public readonly data: FieldsOverridesDataDto;
}

export class ProjectStatusRequestDto implements PROTO.ActivateProjectRequest, PROTO.DeactivateProjectRequest {
  @IsMongoId()
  projectId: string;
}

class ProjectTaskRequestDataDto implements PROTO.ProjectTaskRequestData {
  @IsMongoId()
  tasksIds: string;

  @IsNumber()
  durationInWorkDays: number;

  @IsNumber()
  @IsOptional()
  effort: number;
}
export class AddTasksToProjectRequestDto implements PROTO.AddTasksToProjectRequest {
  @IsMongoId()
  projectId: string;

  @ValidateNested({ each: true })
  tasks: ProjectTaskRequestDataDto[];
}

export class RemoveTasksToProjectRequestDto implements PROTO.RemoveTasksToProjectRequest {
  @IsMongoId()
  projectId: string;

  @IsMongoId({ each: true })
  tasksIds: string[];
}

export class AddLaborersToProjectRequestDto implements PROTO.AddLaborersToProjectRequest {
  @IsMongoId()
  projectId: string;

  @IsMongoId()
  taskId: string;

  @IsMongoId({ each: true })
  laborers: string[];
}

export class RemoveLaborersToProjectRequestDto implements PROTO.RemoveLaborersToProjectRequest {
  @IsMongoId()
  projectId: string;

  @IsMongoId()
  taskId: string;

  @IsMongoId({ each: true })
  laborers: string[];
}
