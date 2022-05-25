import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import {
  LevelType,
  TaskCreateRequest,
  TaskFindAllRequest,
  TaskFindOneRequest,
  TaskRemoveRequest,
  TaskUpdateRequest,
  UnityType,
  TaskUpdateData,
} from 'src/common/proto/project.pb';
export class TaskCreateRequestDto implements TaskCreateRequest {
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  activity: string;

  @IsEnum(LevelType)
  noiseLevel: LevelType;

  @IsEnum(LevelType)
  dirtLevel: LevelType;

  @IsString()
  description: string;

  @IsEnum(UnityType)
  unity: UnityType;

  @IsArray()
  laborers: string[];

  @Type(() => PossibleSkills)
  @ValidateNested()
  possibleSkills: PossibleSkills[];
}
class PossibleSkills {
  @IsString()
  skillId: string;

  @IsNumber()
  requiredSkillLevel: number;
}

export class TaskFindAllRequestDto implements TaskFindAllRequest {}

export class TaskFindOneRequestDto implements TaskFindOneRequest {
  @IsString()
  public readonly id: string;
}

export class TaskUpdateRequestDto implements TaskUpdateRequest {
  @IsString()
  public readonly id: string;

  // @Type(() => TaskUpdateData)
  @ValidateNested()
  public readonly data: TaskUpdateData;
}

export class TaskRemoveRequestDto implements TaskRemoveRequest {
  @IsString()
  public readonly id: string;
}

export class TaskDto {
  @IsString()
  category: string;

  @IsString()
  activity: string;

  @IsArray()
  laborers: string[];

  @IsEnum(LevelType)
  @IsOptional()
  noiseLevel: LevelType;

  @IsEnum(LevelType)
  @IsOptional()
  dirtLevel: LevelType;

  @IsString()
  description: string;

  @IsEnum(UnityType)
  @IsOptional()
  unity: UnityType;

  possibleSkills: PossibleSkills[];
}
