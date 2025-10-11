import { Injectable } from '@nestjs/common';
import { LyricLine, ChordPosition } from '../schema/song.schema';

@Injectable()
export class ChordProParserService {
  /**
   * Convierte texto en formato ChordPro a la estructura interna de la aplicación
   * Formato ChordPro: [C]Imagine there's no [F]heaven
   */
  parseChordProToLyricLines(chordProText: string): LyricLine[] {
    const lines = chordProText.split('\n');
    const lyricLines: LyricLine[] = [];
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Ignorar líneas vacías
      if (trimmedLine === '') {
        continue;
      }

      // Detectar secciones como {verse}, {chorus}, etc.
      if (trimmedLine.startsWith('{') && trimmedLine.endsWith('}')) {
        const sectionContent = trimmedLine.slice(1, -1).toLowerCase();
        
        // Si es una sección musical, actualizar la sección actual
        if (this.isMusicSection(sectionContent)) {
          currentSection = sectionContent;
          continue;
        }
        
        // Si es metadata (title, artist, key), ignorar
        if (sectionContent.includes(':')) {
          continue;
        }
      }

      const parsedLine = this.parseChordProLine(line, currentSection);
      if (parsedLine.text || parsedLine.chords.length > 0) {
        lyricLines.push(parsedLine);
      }
    }

    return lyricLines;
  }

  /**
   * Verifica si es una sección musical válida
   */
  private isMusicSection(section: string): boolean {
    const musicSections = [
      'verse', 'chorus', 'bridge', 'intro', 'outro', 'pre-chorus', 
      'prechorus', 'refrain', 'tag', 'coda', 'instrumental',
      'verse1', 'verse2', 'verse3', 'verse4',
      'chorus1', 'chorus2', 'bridge1', 'bridge2'
    ];
    return musicSections.includes(section.toLowerCase());
  }

  /**
   * Parsea una línea individual en formato ChordPro
   */
  private parseChordProLine(line: string, section?: string): LyricLine {
    const chords: ChordPosition[] = [];
    let text = '';
    let currentIndex = 0;

    // Regex para encontrar acordes en formato [Chord]
    const chordRegex = /\[([^\]]+)\]/g;
    let match;
    let lastIndex = 0;

    while ((match = chordRegex.exec(line)) !== null) {
      // Agregar texto antes del acorde
      const textBeforeChord = line.substring(lastIndex, match.index);
      text += textBeforeChord;
      currentIndex += textBeforeChord.length;

      // Agregar el acorde en la posición actual
      chords.push({
        note: match[1],
        index: currentIndex,
      });

      lastIndex = match.index + match[0].length;
    }

    // Agregar el texto restante después del último acorde
    text += line.substring(lastIndex);

    return {
      text,
      chords,
      section,
    };
  }

  /**
   * Convierte la estructura interna a formato ChordPro para exportar
   */
  convertToChordPro(
    title: string,
    artist: string,
    lyricsLines: LyricLine[],
    key?: string,
  ): string {
    let chordProText = '';

    // Metadatos
    chordProText += `{title: ${title}}\n`;
    chordProText += `{artist: ${artist}}\n`;
    if (key) {
      chordProText += `{key: ${key}}\n`;
    }
    chordProText += '\n';

    // Convertir cada línea agrupando por secciones
    let currentSection = '';
    for (const lyricLine of lyricsLines) {
      // Si cambió la sección, agregar el marcador de sección
      if (lyricLine.section && lyricLine.section !== currentSection) {
        currentSection = lyricLine.section;
        chordProText += `\n{${currentSection}}\n`;
      }
      
      chordProText += this.convertLineToChordPro(lyricLine) + '\n';
    }

    return chordProText;
  }

  /**
   * Convierte una línea individual a formato ChordPro
   */
  private convertLineToChordPro(lyricLine: LyricLine): string {
    if (!lyricLine.chords || lyricLine.chords.length === 0) {
      return lyricLine.text;
    }

    let result = '';
    let lastIndex = 0;

    // Ordenar acordes por posición
    const sortedChords = [...lyricLine.chords].sort((a, b) => a.index - b.index);

    for (const chord of sortedChords) {
      // Agregar texto antes del acorde
      result += lyricLine.text.substring(lastIndex, chord.index);
      // Agregar el acorde
      result += `[${chord.note}]`;
      lastIndex = chord.index;
    }

    // Agregar el texto restante
    result += lyricLine.text.substring(lastIndex);

    return result;
  }

  /**
   * Extrae metadatos del texto ChordPro
   */
  extractMetadata(chordProText: string): {
    title?: string;
    artist?: string;
    key?: string;
  } {
    const metadata: any = {};
    const lines = chordProText.split('\n');

    for (const line of lines) {
      if (line.startsWith('{') && line.endsWith('}')) {
        const content = line.slice(1, -1);
        const [key, ...valueParts] = content.split(':');
        const value = valueParts.join(':').trim();

        switch (key.toLowerCase()) {
          case 'title':
          case 't':
            metadata.title = value;
            break;
          case 'artist':
          case 'a':
            metadata.artist = value;
            break;
          case 'key':
          case 'k':
            metadata.key = value;
            break;
        }
      }
    }

    return metadata;
  }

  /**
   * Valida si un texto está en formato ChordPro válido
   */
  isValidChordPro(text: string): boolean {
    // Verificar que tenga al menos algunos acordes o metadatos
    const hasChords = /\[[^\]]+\]/.test(text);
    const hasMetadata = /\{[^}]+\}/.test(text);
    
    return hasChords || hasMetadata;
  }
}
