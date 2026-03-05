import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SongsService } from './song.service';
import { CreateSongDto, CreateSongChordProDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PermissionType } from '../rols/schema/rol.schema';
import { Song } from './schema/song.schema';

@Controller('songs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @Roles(PermissionType.SONG_CREATE)
  create(@Body() data: CreateSongDto) {
    return this.songsService.create(data);
  }

  /**
   * ⚡ NUEVO: Crear canción desde formato ChordPro - SÚPER RÁPIDO!
   * Ejemplo de uso:
   * POST /songs/chordpro
   * {
   *   "chordProText": "{title: Imagine}\n{artist: John Lennon}\n\n[C]Imagine there's no [F]heaven"
   * }
   */
  @Post('chordpro')
  @Roles(PermissionType.SONG_CREATE)
  createFromChordPro(@Body() data: CreateSongChordProDto) {
    return this.songsService.createFromChordPro(data);
  }

  @Get()
  @Roles(PermissionType.SONG_VIEW)
  findAll() {
    return this.songsService.findAll();
  }

  /**
   * 🔍 Búsqueda avanzada: Buscar por título, artista y/o nota
   * Uso: GET /songs/search/advanced?title=imagine&artist=lennon&key=C
   */
  @Get('search/advanced')
  @Roles(PermissionType.SONG_VIEW)
  async search(
    @Query('title') title?: string,
    @Query('artist') artist?: string,
    @Query('key') key?: string,
    @Query('tags') tags?: string,
  ): Promise<Song[]> {
    return await this.songsService.search({
      title: title || undefined,
      artist: artist || undefined,
      key: key || undefined,
      tags: tags || undefined,
    });
  }

  /**
   * 🔍 Buscar canciones por título
   * Uso: GET /songs/search/title?q=imagine
   */
  @Get('search/title')
  @Roles(PermissionType.SONG_VIEW)
  async searchByTitle(@Query('q') query?: string): Promise<Song[]> {
    if (!query) {
      throw new BadRequestException('Debe proporcionar un término de búsqueda');
    }
    return await this.songsService.searchByTitle(query);
  }

  /**
   * 🔍 Buscar canciones por artista
   * Uso: GET /songs/search/artist?q=lennon
   */
  @Get('search/artist')
  @Roles(PermissionType.SONG_VIEW)
  async searchByArtist(@Query('q') query?: string): Promise<Song[]> {
    if (!query) {
      throw new BadRequestException('Debe proporcionar un término de búsqueda');
    }
    return await this.songsService.searchByArtist(query);
  }

  /**
   * 🔍 Buscar canciones por nota/tono
   * Uso: GET /songs/search/key?q=C
   */
  @Get('search/key')
  @Roles(PermissionType.SONG_VIEW)
  async searchByKey(@Query('q') query?: string): Promise<Song[]> {
    if (!query) {
      throw new BadRequestException(
        'Debe proporcionar una nota/tono para buscar',
      );
    }
    return await this.songsService.searchByKey(query);
  }

  @Get(':id')
  @Roles(PermissionType.SONG_VIEW)
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @Patch(':id')
  @Roles(PermissionType.SONG_EDIT)
  update(@Param('id') id: string, @Body() data: UpdateSongDto) {
    return this.songsService.update(id, data);
  }

  /**
   * 📤 Exportar canción a formato ChordPro para editar fácilmente
   */
  @Get(':id/chordpro')
  @Roles(PermissionType.SONG_VIEW)
  exportToChordPro(@Param('id') id: string) {
    return this.songsService.exportToChordPro(id);
  }

  @Post(':id/transpose')
  @Roles(PermissionType.SONG_EDIT)
  async transpose(@Param('id') id: string, @Body() body: { newKey: string }) {
    const song = await this.songsService.findOne(id);
    if (!song) return { message: 'Canción no encontrada' };

    const newLyricsLines = song.lyricsLines.map((line) => ({
      ...line,
      chords: this.songsService.changeKey(line.chords, song.key, body.newKey),
    }));

    return {
      originalKey: song.key,
      newKey: body.newKey,
      lyricsLines: newLyricsLines,
    };
  }
}
