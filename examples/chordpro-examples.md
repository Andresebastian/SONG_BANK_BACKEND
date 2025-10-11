# 🎵 Ejemplos de Formato ChordPro - ¡Súper Fácil y Rápido!

## 🚀 ¿Por qué ChordPro es Mejor?

**ANTES (tedioso):**
```json
{
  "title": "Imagine",
  "artist": "John Lennon",
  "lyricsLines": [
    {
      "text": "Imagine there's no heaven",
      "chords": [
        { "note": "C", "index": 0 },
        { "note": "F", "index": 19 }
      ]
    },
    {
      "text": "It's easy if you try",
      "chords": [
        { "note": "C", "index": 0 },
        { "note": "F", "index": 12 }
      ]
    }
  ]
}
```

**AHORA (súper fácil):**
```json
{
  "chordProText": "{title: Imagine}\n{artist: John Lennon}\n\n[C]Imagine there's no [F]heaven\n[C]It's easy if you [F]try"
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Canción Simple
```
POST /songs/chordpro
{
  "chordProText": "{title: Amazing Grace}\n{artist: Traditional}\n{key: G}\n\n[G]Amazing [G7]grace how [C]sweet the [G]sound\nThat [G]saved a [D]wretch like [G]me"
}
```

### Ejemplo 2: Canción con Estribillo
```
POST /songs/chordpro
{
  "chordProText": "{title: How Great Thou Art}\n{artist: Stuart K. Hine}\n{key: C}\n\n{verse}\n[C]O Lord my [F]God when [C]I in awesome wonder\n[Am]Consider [F]all the [G]worlds thy hands have [C]made\n\n{chorus}\nThen sings my [F]soul my [C]savior God to [Am]thee\n[F]How great thou [C]art how [G]great thou [C]art"
}
```

### Ejemplo 3: Canción con Acordes Complejos
```
POST /songs/chordpro
{
  "chordProText": "{title: Here I Am to Worship}\n{artist: Tim Hughes}\n{key: E}\n\n[E]Light of the [B]world you [C#m]stepped down into [A]darkness\n[E]Opened my [B]eyes let me [A]see\n[E]Beauty that [B]made this [C#m]heart adore [A]you\n[E]Hope of a [B]life spent with [A]you"
}
```

## 🔄 Conversión Automática

El sistema convierte automáticamente:
- `[C]` → acorde C en posición 0
- `[F]heaven` → acorde F en posición 0, texto "heaven"
- `there's no [F]heaven` → texto "there's no " + acorde F en posición 11 + texto "heaven"

## 📤 Exportar para Editar

```
GET /songs/:id/chordpro
```

Devuelve el texto en formato ChordPro para editar fácilmente y volver a importar.

## ⚡ Ventajas del Nuevo Sistema

1. **10x más rápido** de escribir
2. **Formato estándar** usado mundialmente
3. **Fácil de leer** y editar
4. **Automático** - no calcular posiciones
5. **Compatible** con apps existentes
6. **Exportable** para editar externamente

## 🎯 Casos de Uso

- ✅ Copiar letras de sitios web de acordes
- ✅ Importar desde Ultimate Guitar
- ✅ Escribir canciones nuevas rápidamente
- ✅ Editar canciones existentes
- ✅ Colaborar con músicos

¡Ya no más contar caracteres ni calcular posiciones manualmente! 🎉
