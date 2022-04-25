import { string } from "joi";
import { Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import { Task } from "src/tasks/entities/task.entity";
import mongoose from "mongoose";
import { Document } from 'mongoose';
// @Schema()
export class ProjectTasks  extends Document {

    @Prop({ ref: 'Task' })
    task: Task[];

    @Prop(raw({
        category: string, 
        activity:string,
        noiseLevel: string,
        dirtyLevel: string,
    }))
    fieldsOverwriters: Record<string, any>;
}

export const ProjectTasksSchema = SchemaFactory.createForClass(ProjectTasks);
