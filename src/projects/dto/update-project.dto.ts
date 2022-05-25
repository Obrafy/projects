import { PartialType } from '@nestjs/mapped-types';
import { ProjectCreateRequestDto } from './project.dto';

export class UpdateProjectDto extends PartialType(ProjectCreateRequestDto) {}
