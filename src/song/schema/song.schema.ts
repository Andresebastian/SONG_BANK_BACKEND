import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SongDocument = Song & Document;

export class ChordPosition {
  @Prop({ required: true })
  note: string;
  @Prop({ required: true })
  index: number;
}

export class LyricLine {
  @Prop({ required: true })
  text: string;

  @Prop({ type: [Object], default: [] })
  chords: ChordPosition[];

  @Prop({ required: false })
  section?: string; // verse, chorus, bridge, etc.
}

@Schema({ timestamps: true })
export class Song {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  artist: string;

  @Prop({ type: [Object], default: [] })
  lyricsLines: LyricLine[];

  @Prop({ default: 'C' })
  key: string;

  @Prop({ default: '' })
  notes: string;

  @Prop({ required: false, type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  isBank: boolean;
}

export const SongSchema = SchemaFactory.createForClass(Song);
