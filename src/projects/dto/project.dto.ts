import { Type } from 'class-transformer';
import {
  IsDateString,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import * as PROTO from 'src/common/proto/project.pb';
import { TaskDto } from 'src/tasks/dto/task.dto';
import { Address } from './address.dto';
import { UpdateProjectDto } from './update-project.dto';
export class ProjectCreateRequestDto implements PROTO.ProjectCreateRequest {
  @IsEnum(PROTO.StatusType)
  @IsOptional()
  status: PROTO.StatusType;

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

  @Type(() => UpdateProjectDto)
  @ValidateNested()
  data: UpdateProjectDto;
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

export class FieldsOverridesDataDto implements PROTO.FieldsOverrides {
  @IsString()
  category: string;

  @IsString()
  activity: string;

  @IsString()
  description: string;

  @IsEnum(PROTO.LevelType)
  noiseLevel: PROTO.LevelType;

  @IsEnum(PROTO.LevelType)
  dirtLevel: PROTO.LevelType;

  @IsEnum(PROTO.UnityType)
  unity: PROTO.UnityType;
}
