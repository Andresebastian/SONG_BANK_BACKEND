import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PermissionType } from '../rols/schema/rol.schema';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(PermissionType.USER_CREATE)
  create(
    @Body()
    data: {
      name: string;
      email: string;
      password: string;
      roleId: string;
    },
  ) {
    return this.usersService.create(data);
  }

  @Get()
  @Roles(PermissionType.USER_VIEW)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('directors')
  @Roles(PermissionType.USER_VIEW)
  findDirectors() {
    return this.usersService.findDirectors();
  }

  @Get(':id')
  @Roles(PermissionType.USER_VIEW)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles(PermissionType.USER_EDIT)
  update(@Param('id') id: string, @Body() data: Partial<User>) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @Roles(PermissionType.USER_DELETE)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
