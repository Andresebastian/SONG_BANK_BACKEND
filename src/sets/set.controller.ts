import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { SetsService } from './set.service';
import { CreateSetDto } from './dto/create-set.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PermissionType } from '../rols/schema/rol.schema';

@Controller('sets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  /**
   * Crear un nuevo setlist
   * El nuevo setlist se marca como activo y los anteriores se desactivan
   */
  @Post()
  @Roles(PermissionType.SETLIST_CREATE)
  async create(@Body() dto: CreateSetDto, @Request() req) {
    const newSet = await this.setsService.create(dto, req.user.userId);
    return {
      message: 'Setlist creado correctamente',
      data: newSet,
    };
  }

  /**
   * Obtener el setlist activo
   * Si no hay setlist activo, devuelve un mensaje claro
   */
  @Get('active')
  @Roles(PermissionType.SETLIST_VIEW)
  async findActive() {
    const activeSet = await this.setsService.findActive();
    if (!activeSet) {
      return {
        message: 'No existe un setlist activo en este momento',
        data: null,
      };
    }
    return {
      message: 'Setlist activo encontrado',
      data: activeSet,
    };
  }

  /**
   * Obtener todos los setlists
   * Si no hay setlists, devuelve un mensaje claro
   */
  @Get()
  @Roles(PermissionType.SETLIST_VIEW)
  async findAll() {
    const sets = await this.setsService.findAll();
    if (!sets || sets.length === 0) {
      return {
        message: 'No hay setlists creados',
        data: [],
      };
    }
    return {
      message: `Se encontraron ${sets.length} setlist${sets.length > 1 ? 's' : ''}`,
      data: sets,
    };
  }

  /**
   * Actualizar un setlist
   * Si no se encuentra el setlist, lanza un error 404
   */
  @Patch(':id')
  @Roles(PermissionType.SETLIST_EDIT)
  async update(@Param('id') id: string, @Body() dto: Partial<CreateSetDto>) {
    const updatedSet = await this.setsService.update(id, dto);
    if (!updatedSet) {
      throw new NotFoundException(`Setlist con ID ${id} no encontrado`);
    }
    return {
      message: 'Setlist actualizado correctamente',
      data: updatedSet,
    };
  }
}
