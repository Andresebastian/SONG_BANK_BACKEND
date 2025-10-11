import { IsString, IsArray, IsOptional, IsBoolean, IsEnum, ArrayNotEmpty } from 'class-validator';
import { PermissionType } from '../schema/rol.schema';

export class CreateRolDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionType, { each: true })
  permissions: PermissionType[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
