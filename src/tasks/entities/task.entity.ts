import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

enum LevelType {
  'LOW' = 0,
  'HIGH' = 1,
}

enum UnityType {
  'VB' = 0,
  'M²' = 1,
  'UNID' = 2,
}

class PossibleSkills {
  @Prop()
  skillId: string;

  @Prop()
  requiredSkillLevel: number;
}
@Schema()
export class Task {
  @Prop()
  category: string;

  @Prop()
  activity: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: LevelType, default: LevelType.LOW })
  noiseLevel: string;

  @Prop({ type: String, enum: LevelType, default: LevelType.LOW })
  dirtLevel: string;

  @Prop({ type: String, enum: UnityType, default: UnityType.VB })
  unity: string;

  @Prop({ required: true })
  possibleSkills: PossibleSkills[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
