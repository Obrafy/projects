import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type TaskDocument = Task & Document;

enum LevelType {
    LOW = 'LOW',
    HIGH = 'HIGH',
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

    // @Prop()
    // possibleSkills: {
    //     skill: Skill; // 1 (Pintura de Chapisco) , 3 (Pintura Convencional)
    //     requiredSkillLevel: number; // 2*, 5*;
    // }[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

