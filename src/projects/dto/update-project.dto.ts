import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectRequest } from './project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectRequest) {}
