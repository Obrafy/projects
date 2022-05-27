import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, raw, Schema } from '@nestjs/mongoose';
import { Task, TaskDocument } from 'src/tasks/entities/task.entity';
@Schema({ _id: false })
export class ProjectTasks extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  task: TaskDocument;

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
