import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { TransformEnum } from 'src/common/decorators/transform-enum.decorator';
import {
  TaskCreateRequest,
  TaskFindAllRequest,
  TaskFindOneRequest,
  TaskRemoveRequest,
  TaskUpdateRequest,
  TaskUpdateData,
  PossibleSkills,
  LevelType as ProtoLevelType,
  UnityType as ProtoUnitType,
  DeactivateTaskRequest,
  ActivateTaskRequest,
  AddSkillToTaskRequest,
  SkillRequest,
  RemoveSkillToTaskRequest,
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
  @TransformEnum(LevelType, ProtoLevelType)
  noiseLevel: LevelType;

  @IsEnum(LevelType)
  @TransformEnum(LevelType, ProtoLevelType)
  dirtLevel: LevelType;

  @IsString()
  description: string;

  @IsEnum(UnityType)
  @TransformEnum(UnityType, ProtoUnitType)
  unity: UnityType;

  @Type(() => PossibleSkillsDto)
  @ValidateNested()
  possibleSkills: PossibleSkillsDto[];
}
class PossibleSkillsDto implements PossibleSkills {
  @IsMongoId()
  skillId: string;

  @IsNumber()
  requiredSkillLevel: number;
}

export class TaskFindAllRequestDto implements TaskFindAllRequest { }

export class TaskFindOneRequestDto implements TaskFindOneRequest {
  @IsMongoId()
  public readonly taskId: string;
}

export class TaskUpdateRequestDto implements TaskUpdateRequest {
  @IsMongoId()
  public readonly taskId: string;

  // @Type(() => TaskUpdateData)
  @ValidateNested()
  public readonly data: TaskUpdateData;
}

export class TaskRemoveRequestDto implements TaskRemoveRequest {
  @IsMongoId()
  public readonly taskId: string;
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

export class TaskStatusRequestDto implements ActivateTaskRequest, DeactivateTaskRequest {
  @IsMongoId()
  taskId: string;
}

class SkillRequestDto implements SkillRequest {
  @IsMongoId()
  id: string;

  @IsNumber()
  requiredSkillLevel: number;
}

export class AddSkillToTaskRequestDto implements AddSkillToTaskRequest {
  @IsMongoId()
  taskId: string;

  @Type(() => SkillRequestDto)
  @ValidateNested()
  skills: SkillRequestDto[];
}


export class RemoveSkillToTaskRequestDto implements RemoveSkillToTaskRequest {

  @IsMongoId()
  taskId: string;

  @IsMongoId({ each: true })
  skillIds: string[];
}