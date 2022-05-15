import { Type } from 'class-transformer';
import {
  IsDateString,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Task } from 'src/tasks/entities/task.entity';

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

  @IsNotEmpty()
  @ValidateNested()
  tasks: Task[];
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
