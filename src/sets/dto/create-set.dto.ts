import {
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class SongInSetDto {
  @IsString()
  songId: string;

  @IsOptional()
  @IsString()
  transposeKey?: string;

  @IsInt()
  @Min(0)
  order: number;
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
