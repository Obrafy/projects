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
  TaskCreateRequest,
  TaskFindAllRequest,
  TaskFindOneRequest,
  TaskRemoveRequest,
  TaskUpdateRequest,
  TaskUpdateData,
  PossibleSkills,
} from 'src/common/dto/proto/project.pb';

enum LevelType {
  'LOW' = 'LOW',
  'HIGH' = 'HIGH',
}

enum UnityType {
  'VB' = 'VB',
  'M2' = 'M²',
  'UNID' = 'UNID',
}

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

  @Type(() => PossibleSkillsDto)
  @ValidateNested()
  possibleSkills: PossibleSkillsDto[];
}
class PossibleSkillsDto implements PossibleSkills {
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

  @Type(() => PossibleSkillsDto)
  @ValidateNested()
  possibleSkills: PossibleSkillsDto[];
}
