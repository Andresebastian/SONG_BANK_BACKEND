import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song, SongDocument } from './schema/song.schema';
import { CreateSongDto, CreateSongChordProDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ChordProParserService } from './services/chordpro-parser.service';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
    private chordProParser: ChordProParserService,
  ) {}

  async create(data: CreateSongDto): Promise<Song> {
    const lyricsLines = data.lyricsLines.map((line) => ({
      text: line.text,
      chords: line.chords ?? [],
    }));

    const song = new this.songModel({
      ...data,
      lyricsLines,
    });

    return song.save();
  }

  /**
   * Crea una canción desde formato ChordPro - MUCHO MÁS FÁCIL Y RÁPIDO
   */
  async createFromChordPro(data: CreateSongChordProDto): Promise<Song> {
    // Extraer metadatos del texto ChordPro si no se proporcionaron
    const metadata = this.chordProParser.extractMetadata(data.chordProText);

    const title = data.title || metadata.title || 'Canción sin título';
    const artist = data.artist || metadata.artist || 'Artista desconocido';
    const key = data.key || metadata.key || 'C';

    // Convertir el texto ChordPro a la estructura interna
    const lyricsLines = this.chordProParser.parseChordProToLyricLines(
      data.chordProText,
    );

    const song = new this.songModel({
      title,
      artist,
      key,
      notes: data.notes || '',
      isBank: data.isBank || false,
      lyricsLines,
    });

    return song.save();
  }

  async findAll(): Promise<Song[]> {
    return this.songModel.find().lean().exec();
  }

  async findBank(): Promise<Song[]> {
    return this.songModel.find({ isBank: true }).lean().exec();
  }

  async findSundayList(): Promise<Song[]> {
    return this.songModel.find({ isBank: false }).lean().exec();
  }

  async findOne(id: string): Promise<Song> {
    const song = await this.songModel.findById(id).lean().exec();
    if (!song) throw new NotFoundException('Canción no encontrada');
    return song;
  }

  /**
   * Buscar canciones por título (búsqueda parcial, case insensitive)
   */
  async searchByTitle(title: string): Promise<Song[]> {
    return this.songModel
      .find({ title: { $regex: title, $options: 'i' } })
      .lean()
      .exec() as Promise<Song[]>;
  }

  /**
   * Buscar canciones por artista (búsqueda parcial, case insensitive)
   */
  async searchByArtist(artist: string): Promise<Song[]> {
    return this.songModel
      .find({ artist: { $regex: artist, $options: 'i' } })
      .lean()
      .exec() as Promise<Song[]>;
  }

  /**
   * Buscar canciones por tono/nota (búsqueda exacta, case insensitive)
   */
  async searchByKey(key: string): Promise<Song[]> {
    return this.songModel
      .find({ key: { $regex: `^${key}$`, $options: 'i' } })
      .lean()
      .exec() as Promise<Song[]>;
  }

  /**
   * Búsqueda avanzada con múltiples criterios opcionales
   */
  async search(params: {
    title?: string;
    artist?: string;
    key?: string;
  }): Promise<Song[]> {
    const query: any = {};

    if (params.title) {
      query.title = { $regex: params.title, $options: 'i' };
    }

    if (params.artist) {
      query.artist = { $regex: params.artist, $options: 'i' };
    }

    if (params.key) {
      query.key = { $regex: `^${params.key}$`, $options: 'i' };
    }

    return this.songModel.find(query).lean().exec() as Promise<Song[]>;
  }

  async update(id: string, data: UpdateSongDto): Promise<Song> {
    const lyricsLines = data.lyricsLines?.map((line) => ({
      text: line.text,
      chords: line.chords ?? [],
    }));

    const song = await this.songModel
      .findByIdAndUpdate(id, { ...data, lyricsLines }, { new: true })
      .lean()
      .exec();
    if (!song) throw new NotFoundException('Canción no encontrada');
    return song;
  }

  async remove(id: string): Promise<void> {
    const result = await this.songModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Canción no encontrada');
  }

  /**
   * Exporta una canción a formato ChordPro para fácil edición
   */
  async exportToChordPro(id: string): Promise<string> {
    const song = await this.findOne(id);
    return this.chordProParser.convertToChordPro(
      song.title,
      song.artist,
      song.lyricsLines,
      song.key,
    );
  }

  changeKey(
    chords: { note: string; index: number }[],
    fromKey: string,
    toKey: string,
  ) {
    // Normalizar las notas a sostenidos para evitar problemas con bemoles
    const normalizeNote = (note: string): string => {
      const noteMap: { [key: string]: string } = {
        C: 'C',
        'C#': 'C#',
        Db: 'C#',
        D: 'D',
        'D#': 'D#',
        Eb: 'D#',
        E: 'E',
        F: 'F',
        'F#': 'F#',
        Gb: 'F#',
        G: 'G',
        'G#': 'G#',
        Ab: 'A#',
        A: 'A',
        'A#': 'A#',
        Bb: 'A#',
        B: 'B',
      };
      return noteMap[note] || note;
    };

    const notes = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];

    const normalizedFromKey = normalizeNote(fromKey);
    const normalizedToKey = normalizeNote(toKey);
    const fromIndex = notes.indexOf(normalizedFromKey);
    const toIndex = notes.indexOf(normalizedToKey);
    if (fromIndex === -1 || toIndex === -1) {
      console.warn(`Nota no válida: fromKey=${fromKey}, toKey=${toKey}`);
      return chords;
    }
    const shift = (toIndex - fromIndex + 12) % 12;

    return chords.map((chordObj) => {
      // Manejar acordes con bajo (slash chords) como D#/G
      const slashMatch = chordObj.note.match(
        /^([A-G][b#]?)(.*)\/([A-G][b#]?)$/,
      );

      if (slashMatch) {
        // Acorde con bajo: D#/G
        const [, root, suffix, bass] = slashMatch;
        const normalizedRoot = normalizeNote(root);
        const normalizedBass = normalizeNote(bass);
        const rootIndex = notes.indexOf(normalizedRoot);
        const bassIndex = notes.indexOf(normalizedBass);
        if (rootIndex === -1 || bassIndex === -1) {
          console.warn(`Nota de acorde no válida: ${root}/${bass}`);
          return chordObj;
        }

        const newRoot = notes[(rootIndex + shift) % 12];
        const newBass = notes[(bassIndex + shift) % 12];
        return {
          ...chordObj,
          note: newRoot + suffix + '/' + newBass,
        };
      } else {
        // Acorde normal sin bajo
        const match = chordObj.note.match(/^([A-G][b#]?)(.*)$/);
        if (!match) return chordObj;

        const [, root, suffix] = match;
        const normalizedRoot = normalizeNote(root);
        const rootIndex = notes.indexOf(normalizedRoot);
        if (rootIndex === -1) {
          console.warn(`Nota de acorde no válida: ${root}`);
          return chordObj;
        }

        const newRoot = notes[(rootIndex + shift) % 12];
        return {
          ...chordObj,
          note: newRoot + suffix,
        };
      }
    });
  }
}
