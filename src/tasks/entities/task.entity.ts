import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from 'src/common/dto/status.enum';

export type TaskDocument = Task & Document;

enum LevelType {
  'LOW' = 'LOW',
  'HIGH' = 'HIGH',
}

enum UnityType {
  'VB' = 'VB',
  'M2' = 'M²',
  'UNID' = 'UNID',
}

export class PossibleSkills {
  constructor(skillId, requiredSkillLevel) {
    this.skillId = skillId;
    this.requiredSkillLevel = requiredSkillLevel;
  }

  @Prop()
  skillId: string;

  @Prop()
  requiredSkillLevel: number;
}
@Schema()
export class Task {
  @Prop({ required: true })
  priority: number;

  @Prop({ required: false, default: Status.ACTIVE })
  status: Status;

  @Prop()
  category: string;

  @Prop()
  activity: string;

  @Prop()
  description: string;

  @Prop({ required: false, default: LevelType.LOW })
  noiseLevel: LevelType;

  @Prop({ required: false, default: LevelType.LOW })
  dirtLevel: LevelType;

  @Prop({ required: false, default: UnityType.VB })
  unity: UnityType;

  @Prop({ required: true })
  possibleSkills: PossibleSkills[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
