import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, raw, Schema } from '@nestjs/mongoose';
import { Task } from 'src/tasks/entities/task.entity';
@Schema({ _id: false })
export class ProjectTasks extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  task: Task;

  @Prop(
    raw({
      category: { type: String },
      activity: { type: String },
      noiseLevel: { type: String },
      dirtyLevel: { type: String },
    }),
  )
  fieldsOverwriters: Record<string, any>;
}
