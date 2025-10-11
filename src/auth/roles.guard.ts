import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/roles.decorator';
import { RolService } from '../rols/rol.service';
import { PermissionType } from '../rols/schema/rol.schema';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolService: RolService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<PermissionType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.roleId) {
      return false;
    }

    // Obtener los permisos del rol del usuario
    const userPermissions = await this.rolService.getPermissionsByRole(
      user.roleId,
    );

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    return requiredRoles.some((role) => userPermissions.includes(role));
  }
}
