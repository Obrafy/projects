import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types} from 'mongoose';
import mongoose from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task extends mongoose.Document {

    @Prop()
    category: string;

    @Prop()
    activity: string;

    @Prop()
    noiseLevel: string;

    @Prop()
    messLevel: string // LOW Pesquisar ENUM
}

export const TaskSchema = SchemaFactory.createForClass(Task);
//export = mongoose.model<UserDoc>('User', userSchema);


   // @Prop()
    // possibleSkills: {
    //     skill: Skill; // 1 (Pintura de Chapisco) , 3 (Pintura Convencional)
    //     requiredSkillLevel: number; // 2*, 5*;
    // }[];


