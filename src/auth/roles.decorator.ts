import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../rols/schema/rol.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: PermissionType[]) =>
  SetMetadata(ROLES_KEY, roles);
