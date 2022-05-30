import mongoose, { Document } from 'mongoose';
import { Prop, raw } from '@nestjs/mongoose';
import { Task, TaskDocument } from 'src/tasks/entities/task.entity';
import { Type } from 'class-transformer';

export type ProjectTasksDocument = ProjectTasks & Document;

export class ProjectTasks {
  constructor(task: TaskDocument, laborers: string[], fieldsOverrides: Record<string, any>) {
    this.task = task._id;
    this.laborers = laborers;
    this.fieldsOverrides = fieldsOverrides;
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  @Type(() => Task)
  task: Task;

  @Prop()
  laborers: string[];

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
