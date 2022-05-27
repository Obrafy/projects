import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from './address.entity';
import { ProjectTasks } from './projectTasks.entity';
import { Status } from 'src/common/dto/status.enum';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ required: false, default: Status.ACTIVE })
  status: Status;

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

  @Prop({ instance: [ProjectTasks], required: false })
  tasks: ProjectTasks[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
