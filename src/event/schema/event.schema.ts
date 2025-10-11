// event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Set' })
  setId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  directorId: Types.ObjectId;

  @Prop({ required: true })
  directorName: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ default: 'active' })
  status: 'active' | 'archived' | 'draft';
}

export const EventSchema = SchemaFactory.createForClass(Event);
