// src/songs/dto/create-song.dto.ts
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChordPositionDto {
  @IsString()
  note: string;

  @IsInt()
  @Min(0)
  index: number;
}

class LyricLineDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChordPositionDto)
  chords?: ChordPositionDto[];

  @IsOptional()
  @IsString()
  section?: string; // verse, chorus, bridge, etc.
}

export class CreateSongDto {
  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LyricLineDto)
  lyricsLines: LyricLineDto[];

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  isBank?: boolean;

  @IsOptional()
  @IsString()
  youtubeUrl?: string;
}

// Nueva alternativa: formato ChordPro
export class CreateSongChordProDto {
  @IsOptional()
  @IsString()
  title?: string; // Opcional - se extrae automáticamente del chordProText

  @IsOptional()
  @IsString()
  artist?: string; // Opcional - se extrae automáticamente del chordProText

  @IsString()
  chordProText: string; // Texto completo en formato ChordPro

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  isBank?: boolean;

  @IsOptional()
  @IsString()
  youtubeUrl?: string;
}
