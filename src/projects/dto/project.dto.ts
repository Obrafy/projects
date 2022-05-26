import { Type } from 'class-transformer';
import {
  IsDateString,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { TaskDto } from 'src/tasks/dto/task.dto';
import { Address } from './address.dto';
import * as PROTO from '../../common/dto/proto/project.pb';
export class ProjectCreateRequestDto implements PROTO.ProjectCreateRequest {
  @IsEnum(PROTO.Status)
  @IsOptional()
  status: PROTO.Status;

  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  expectedFinishedDate;

  @IsString()
  responsible: string;

  @Type(() => Address)
  @ValidateNested()
  @IsNotEmpty()
  address: Address;

  @Type(() => TaskDto)
  @ValidateNested()
  @IsNotEmpty()
  tasks: TaskDto[];
}

export class ProjectFindAllRequestDto implements PROTO.ProjectFindAllRequest {}

export class ProjectFindOneRequestDto implements PROTO.ProjectFindOneRequest {
  @IsString()
  public readonly id: string;
}

export class ProjectUpdateRequestDto implements PROTO.ProjectUpdateRequest {
  @IsString()
  public readonly id: string;

  // @Type(() => PROTO.UpdateProjectData)
  @ValidateNested()
  data: PROTO.UpdateProjectData;
}

export class ProjectRemoveRequestDto implements PROTO.ProjectRemoveRequest {
  @IsString()
  public readonly id: string;
}

export class FindAllTaskOfProjectRequestDto
  implements PROTO.FindAllTaskOfProjectRequest
{
  @IsString()
  public readonly id: string;
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
  category: string;

  @IsString()
  activity: string;

  @IsString()
  description: string;

  @IsEnum(LevelType)
  noiseLevel: LevelType;

  @IsEnum(LevelType)
  dirtLevel: LevelType;

  @IsEnum(UnityType)
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

