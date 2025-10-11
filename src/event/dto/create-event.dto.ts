// create-event.dto.ts
import { IsString, IsDateString, IsOptional, IsMongoId } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  setId: string;

  @IsOptional()
  @IsString()
  directorName?: string;

  @IsString()
  directorId: string;

  @IsString()
  status: 'active' | 'archived' | 'draft';
}
