import mongoose, { Document } from 'mongoose';
import { Prop, raw } from '@nestjs/mongoose';
import { Task, TaskDocument } from 'src/tasks/entities/task.entity';
import { Type } from 'class-transformer';

export type ProjectTasksDocument = ProjectTasks & Document;

type NewProjectTaskValues = {
  task: TaskDocument;
  effort: number;
  durationInWorkDays: number;
  laborers?: string[];
  fieldsOverrides?: Record<string, any>;
};

export class ProjectTasks {
  constructor({ durationInWorkDays, effort, task, laborers = [], fieldsOverrides = {} }: NewProjectTaskValues) {
    this.task = task._id;
    this.laborers = laborers;
    this.fieldsOverrides = fieldsOverrides;
    this.effort = effort;
    this.durationInWorkDays = durationInWorkDays;
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  @Type(() => Task)
  task: TaskDocument;

  @Prop()
  laborers: string[];

  @Prop({ required: false, default: 1 })
  effort: number;

  @Prop({ required: true })
  durationInWorkDays: number;

  @Prop(
    raw({
      category: { type: String },
      activity: { type: String },
      noiseLevel: { type: String },
      dirtLevel: { type: String },
      description: { type: String },
      unity: { type: String },
    }),
  )
  fieldsOverrides: Record<string, any>;
}
