import {  Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types} from 'mongoose';


export type AddressDocument = Address & Document;

@Schema()
export class Address {

    @Prop()
    zipCode: string;

    @Prop()
    street: string;

    @Prop()
    number: string;

    @Prop()
    neighborhood: string;

    @Prop()
    city: string;

    @Prop()
    state: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);






