import { IsString, IsDateString, IsOptional, IsMongoId } from 'class-validator';

export class UpdateDirectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsMongoId()
  directorId?: string;

  @IsOptional()
  @IsMongoId()
  eventId?: string;
}
