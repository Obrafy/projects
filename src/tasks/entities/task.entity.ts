import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Skill } from "./skill.entity";

export type TaskDocument = Task & Document;

enum LevelType {
    LOW = 'LOW',
    HIGH = 'HIGH',
}

@Schema({ _id: false })
export class PossibleSkills extends Document {

    @Prop({ type: Skill, required: true })
    skill: Skill;

    @Prop({ required: true })
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

    @Prop({ type: PossibleSkills, required: true })
    possibleSkills: PossibleSkills[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);