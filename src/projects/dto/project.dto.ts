import { Type } from 'class-transformer';
import {
  IsDateString,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

class Address {
  @IsString()
  zipCode: string;
  @IsString()
  street: string;
  @IsString()
  number: string;
  @IsString()
  neighborhood: string;
  @IsString()
  city: string;
  @IsString()
  state: string;
}

export class CreateProjectRequest {
  id: string;
  status: string;

  @IsNotEmpty()
  startDate: Date;

  endDate: Date;

  @IsDateString()
  @IsNotEmpty()
  expectedFinishedDate;

  @IsString()
  responsible: string;

  @IsNotEmpty()
  @Type(() => Address)
  @ValidateNested()
  address: Address;

  @Type(() => CreateTaskDto)
  @ValidateNested()
  @IsNotEmpty()
  tasks: CreateTaskDto[];
}

export class FindOneProjectRequest {
  @IsString()
  public readonly id: string;
}

export class UpdateRequest {
  @IsString()
  public readonly id: string;

  @IsObject()
  public readonly data: any;
}

export class RemoveProjectRequest {
  @IsString()
  public readonly id: string;
}

export class FindAllTaskOfProjectRequest {
  @IsString()
  public readonly id: string;
}

class FieldsOverwrite {
  @IsString()
  category: string;
  @IsString()
  activity: string;
  @IsString()
  description: string;
  @IsString()
  noiseLevel: string;
  @IsString()
  dirtLevel: string;
  @IsString()
  unity: string;
}

export class FieldsOverwritersRequest {
  @IsString()
  public readonly projectId: string;

  @IsString()
  public readonly taskId: string;

  @Type(() => FieldsOverwrite)
  @ValidateNested()
  // @IsNotEmpty()
  public readonly data: FieldsOverwrite;
}
