import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { Document, SchemaTypes, Types} from 'mongoose';
import { Address } from './address.entity';
import { ProjectTasks, ProjectTasksSchema } from './projectTasks.entity';
import { Document, Schema as MongooseSchema } from 'mongoose';


export type ProjectDocument = Project & Document;

@Schema()
export class Project {
    // @Prop({ type: SchemaTypes.ObjectId})
    // id: Types.ObjectId;

    @Prop()
    status: string;

    @Prop({ type: Date, default: Date.now })
    startDate: Date;

    @Prop({ type: Date })
    endDate: Date;

    @Prop({ type: Date })
    expectedFinishedDate: Date;

    @Prop()
    responsible: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Address' })
    address: Address; 


    @Prop({ type: ProjectTasksSchema })
    tasks: ProjectTasks;  
}

export const ProjectSchema = SchemaFactory.createForClass(Project);


// // Parent Schema
// @Schema()
// export class ChaptersApi extends Document {
//   // Array example
//   @Prop({ type: [BodySchema], default: [] })
//   body: BodyContentInterface[];

//   // Single example
  
//   body: BodyContentInterface;
// }