import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { SetsService } from './set.service';
import { ArrangementSectionDto, CreateSetDto } from './dto/create-set.dto';
import { RateSetSongDto } from './dto/rate-set-song.dto';
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

  @Get('song-rankings')
  @Roles(PermissionType.SETLIST_VIEW)
  async getSongRankings() {
    const rankings = await this.setsService.getSongRankings();
    return {
      message: `Se encontraron ${rankings.length} canción${rankings.length !== 1 ? 'es' : ''} calificadas`,
      data: rankings,
    };
  }

  @Get('reports/songs')
  @Roles(PermissionType.SETLIST_VIEW)
  async getSongReports(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const report = await this.setsService.getSongReports(from, to);
    return {
      message: 'Reporte de canciones generado correctamente',
      data: report,
    };
  }

  @Patch(':setId/songs/:songId/rating')
  @Roles(PermissionType.SETLIST_EDIT)
  async rateSong(
    @Param('setId') setId: string,
    @Param('songId') songId: string,
    @Body() dto: RateSetSongDto,
  ) {
    const updatedSet = await this.setsService.rateSong(
      setId,
      songId,
      dto.rating,
    );
    return {
      message: 'Calificación guardada correctamente',
      data: updatedSet,
    };
  }

  /**
   * Actualizar la estructura/arreglo de una canción solo dentro de este setlist.
   * Útil durante el ensayo para mover secciones y dejar comentarios visibles al equipo.
   */
  @Patch(':setId/songs/:songId/arrangement')
  @Roles(PermissionType.SETLIST_EDIT)
  async updateSongArrangement(
    @Param('setId') setId: string,
    @Param('songId') songId: string,
    @Body() dto: { arrangementSections: ArrangementSectionDto[] },
  ) {
    const updatedSet = await this.setsService.updateSongArrangement(
      setId,
      songId,
      dto.arrangementSections,
    );

    return {
      message: 'Estructura de la canción actualizada para este setlist',
      data: updatedSet,
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
