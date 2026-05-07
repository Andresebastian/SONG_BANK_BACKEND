import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Set extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  title: string;

  @Prop({
    type: [
      {
        songId: { type: Types.ObjectId, ref: 'Song' },
        order: Number,
        transposeKey: { type: String, required: false },
        rating: { type: Number, min: 1, max: 5, required: false },
        ratedAt: { type: Date, required: false },
      },
    ],
  })
  songs: {
    songId: Types.ObjectId;
    order: number;
    transposeKey?: string;
    rating?: number;
    ratedAt?: Date;
  }[];

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const SetSchema = SchemaFactory.createForClass(Set);
