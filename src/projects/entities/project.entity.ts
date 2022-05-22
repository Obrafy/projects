import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from './address.entity';
import { ProjectTasks } from './projectTasks.entity';

enum StatusType {
  START = 'start',
  FINISHED = 'finished',
  IN_PROGRESS = 'in-progress',
}

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ type: String, enum: StatusType, default: StatusType.START })
  status: string;

  @Prop({ type: Date, default: Date.now })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Date })
  expectedFinishedDate: Date;

  @Prop()
  responsible: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Address' })
  address: Address;

  @Prop([ProjectTasks])
  tasks: ProjectTasks[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
