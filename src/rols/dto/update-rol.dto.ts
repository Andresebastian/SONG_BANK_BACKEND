import { IsString, IsArray, IsOptional, IsBoolean, IsEnum, ArrayNotEmpty } from 'class-validator';
import { PermissionType } from '../schema/rol.schema';

export class UpdateRolDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionType, { each: true })
  permissions?: PermissionType[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
