import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PermissionType } from './schema/rol.schema';

@Controller('roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PermissionType.ROLE_CREATE)
  create(@Body() createRolDto: CreateRolDto, @Request() req) {
    return this.rolService.create(createRolDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.rolService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.rolService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PermissionType.ROLE_VIEW)
  findOne(@Param('id') id: string) {
    return this.rolService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PermissionType.ROLE_EDIT)
  update(@Param('id') id: string, @Body() updateRolDto: UpdateRolDto, @Request() req) {
    return this.rolService.update(id, updateRolDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PermissionType.ROLE_DELETE)
  remove(@Param('id') id: string) {
    return this.rolService.remove(id);
  }

  @Post('predefined')
  createPredefinedRoles() {
    return this.rolService.createPredefinedRoles('system');
  }
}
