import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsInt,
  IsBoolean,
} from 'class-validator';

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
}

export class UpdateSongDto {
  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LyricLineDto)
  lyricsLines?: LyricLineDto[];
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isBank?: boolean;
}
