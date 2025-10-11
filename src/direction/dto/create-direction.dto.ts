import { IsString, IsDateString, IsOptional, IsMongoId } from 'class-validator';

export class CreateDirectionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsMongoId()
  directorId: string;

  @IsOptional()
  @IsMongoId()
  eventId?: string;
}
