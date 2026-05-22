import {
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ArrangementSectionDto {
  @IsString()
  section: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  repeat?: number;
}

class SongInSetDto {
  @IsString()
  songId: string;

  @IsOptional()
  @IsString()
  transposeKey?: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArrangementSectionDto)
  arrangementSections?: ArrangementSectionDto[];
}

export class CreateSetDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongInSetDto)
  songs: SongInSetDto[];
}
