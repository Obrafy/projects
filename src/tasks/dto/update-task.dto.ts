import { PartialType } from '@nestjs/mapped-types';
import { TaskCreateRequestDto } from './task.dto';

export class UpdateTaskDto extends PartialType(TaskCreateRequestDto) {}
