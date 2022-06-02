import { Type } from 'class-transformer';
import { IsDateString, IsString, IsNotEmpty, ValidateNested, IsEnum, IsOptional, IsMongoId } from 'class-validator';

import { Address } from './address.dto';
import * as PROTO from '../../common/dto/proto/project.pb';
import { PartialBy } from 'src/common/types/global';

export class ProjectCreateRequestDto implements PartialBy<PROTO.ProjectCreateRequest, 'tasks'> {
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  expectedFinishedDate: string;

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
  expectedFinishedDate?: string;
  startDate?: string;
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

export class AddTasksToProjectRequestDto implements PROTO.AddTasksToProjectRequest {
  @IsMongoId()
  projectId: string;

  @IsMongoId({ each: true })
  tasksIds: string[];
}

export class RemoveTasksToProjectRequestDto implements PROTO.RemoveTasksToProjectRequest {
  @IsMongoId()
  projectId: string;

  @IsMongoId({ each: true })
  tasksIds: string[];
}
