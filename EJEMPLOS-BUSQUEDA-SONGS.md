# 🔍 Ejemplos de Búsqueda de Canciones

## Endpoints Disponibles

### 1. Búsqueda por Título
**Endpoint:** `GET /songs/search/title?q=<término>`

Busca canciones cuyo título contenga el término de búsqueda (no sensible a mayúsculas/minúsculas).

**Ejemplo:**
```http
GET /songs/search/title?q=imagine
```

Encontrará canciones como:
- "Imagine"
- "Just Imagine"
- "Imagínate"

---

### 2. Búsqueda por Artista
**Endpoint:** `GET /songs/search/artist?q=<término>`

Busca canciones cuyo artista contenga el término de búsqueda (no sensible a mayúsculas/minúsculas).

**Ejemplo:**
```http
GET /songs/search/artist?q=lennon
```

Encontrará canciones de:
- "John Lennon"
- "Lennon & McCartney"
- Cualquier artista que contenga "lennon"

---

### 3. Búsqueda por Nota/Tono
**Endpoint:** `GET /songs/search/key?q=<nota>`

Busca canciones que estén en una nota/tono específico (búsqueda exacta, no sensible a mayúsculas/minúsculas).

**Ejemplo:**
```http
GET /songs/search/key?q=C
```

Encontrará todas las canciones en tono de **C**.

**Otros ejemplos:**
```http
GET /songs/search/key?q=G
GET /songs/search/key?q=D#
GET /songs/search/key?q=Am
```

---

### 4. Búsqueda Avanzada (Múltiples Criterios)
**Endpoint:** `GET /songs/search/advanced?title=<término>&artist=<término>&key=<nota>`

Combina múltiples criterios de búsqueda. Todos los parámetros son opcionales, pero puedes usar cualquier combinación.

**Ejemplos:**

**Buscar por título y artista:**
```http
GET /songs/search/advanced?title=love&artist=beatles
```

**Buscar por artista y tono:**
```http
GET /songs/search/advanced?artist=hillsong&key=G
```

**Buscar por los tres criterios:**
```http
GET /songs/search/advanced?title=gloria&artist=marcos&key=D
```

**Buscar solo por título:**
```http
GET /songs/search/advanced?title=aleluya
```

---

## Respuestas

Todos los endpoints devuelven un array de canciones que coinciden con los criterios:

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Imagine",
    "artist": "John Lennon",
    "key": "C",
    "notes": "Canción icónica de 1971",
    "isBank": true,
    "lyricsLines": [...],
    "createdAt": "2025-10-09T...",
    "updatedAt": "2025-10-09T..."
  },
  {
    ...
  }
]
```

Si no se encuentra ninguna canción, devuelve un array vacío: `[]`

---

## Errores

### Parámetro faltante
Si no se proporciona el parámetro requerido `q` en los endpoints individuales:

```json
{
  "statusCode": 400,
  "message": "Debe proporcionar un término de búsqueda",
  "error": "Bad Request"
}
```

---

## Características

✅ **Búsqueda parcial:** Para título y artista, busca coincidencias parciales  
✅ **Case insensitive:** No distingue entre mayúsculas y minúsculas  
✅ **Búsqueda exacta:** Para nota/tono (key), busca coincidencias exactas  
✅ **Combinación de criterios:** Búsqueda avanzada permite combinar múltiples filtros  
✅ **Protegido por autenticación:** Requiere JWT token y permisos de `SONG_VIEW`

---

## Ejemplos con cURL

### Búsqueda por título:
```bash
curl -X GET "http://localhost:3000/songs/search/title?q=imagine" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Búsqueda por artista:
```bash
curl -X GET "http://localhost:3000/songs/search/artist?q=lennon" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Búsqueda por tono:
```bash
curl -X GET "http://localhost:3000/songs/search/key?q=C" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Búsqueda avanzada:
```bash
curl -X GET "http://localhost:3000/songs/search/advanced?title=love&artist=beatles&key=G" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Notas Adicionales

- Todas las búsquedas respetan el campo `isBank` de la canción
- Los resultados se devuelven en el orden en que se encuentran en la base de datos
- No hay límite de resultados por defecto
- Las búsquedas utilizan índices de MongoDB para mejor rendimiento

