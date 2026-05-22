import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class ArrangementSection {
  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: false, default: '' })
  comment?: string;

  @Prop({ required: false, min: 1, default: 1 })
  repeat?: number;
}

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
        arrangementSections: {
          type: [
            {
              section: { type: String, required: true },
              order: { type: Number, required: true },
              comment: { type: String, required: false, default: '' },
              repeat: { type: Number, min: 1, required: false, default: 1 },
            },
          ],
          default: [],
        },
      },
    ],
  })
  songs: {
    songId: Types.ObjectId;
    order: number;
    transposeKey?: string;
    rating?: number;
    ratedAt?: Date;
    arrangementSections?: ArrangementSection[];
  }[];

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const SetSchema = SchemaFactory.createForClass(Set);
