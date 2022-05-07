import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

enum LevelType {
    LOW = 'LOW',
    HIGH = 'HIGH',
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

    @Prop({ type: String, enum: LevelType, default: LevelType.LOW })
    noiseLevel: string;

    @Prop({ type: String, enum: LevelType, default: LevelType.LOW })
    messLevel: string;

    @Prop({ required: true })
    possibleSkills: PossibleSkills[]
}

export const TaskSchema = SchemaFactory.createForClass(Task);


