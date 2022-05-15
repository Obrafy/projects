import { IsString, IsObject } from 'class-validator';

export class FindOneTaskRequest {
  @IsString()
  public readonly id: string;
}

export class UpdateRequest {
  @IsString()
  public readonly id: string;

  @IsObject()
  public readonly data: any;
}

export class RemoveTaskRequest {
  @IsString()
  public readonly id: string;
}
