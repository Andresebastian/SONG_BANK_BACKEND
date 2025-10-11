# Sistema de Roles y Permisos - SongBank Backend

## Descripción General

Este sistema implementa un control de acceso basado en roles (RBAC) que permite gestionar los permisos de diferentes tipos de usuarios en la aplicación SongBank.

## Roles Predefinidos

### 1. Músico
- **Permisos:**
  - `song:view` - Ver canciones
  - `song:edit` - Editar canciones
  - `setlist:view` - Ver setlists
  - `event:view` - Ver eventos

### 2. Corista
- **Permisos:**
  - `song:view` - Ver canciones
  - `song:edit` - Editar canciones
  - `setlist:view` - Ver setlists
  - `event:view` - Ver eventos

### 3. Director/Músico
- **Permisos:**
  - `song:view` - Ver canciones
  - `song:create` - Crear canciones
  - `song:edit` - Editar canciones
  - `song:delete` - Eliminar canciones
  - `setlist:view` - Ver setlists
  - `setlist:create` - Crear setlists
  - `setlist:edit` - Editar setlists
  - `setlist:delete` - Eliminar setlists
  - `event:view` - Ver eventos
  - `event:create` - Crear eventos
  - `event:edit` - Editar eventos
  - `event:delete` - Eliminar eventos
  - `direction:view` - Ver direcciones
  - `direction:create` - Crear direcciones
  - `direction:edit` - Editar direcciones
  - `direction:delete` - Eliminar direcciones
  - `user:view` - Ver usuarios

### 4. Director/Corista
- **Permisos:**
  - `song:view` - Ver canciones
  - `song:create` - Crear canciones
  - `song:edit` - Editar canciones
  - `song:delete` - Eliminar canciones
  - `setlist:view` - Ver setlists
  - `setlist:create` - Crear setlists
  - `setlist:edit` - Editar setlists
  - `setlist:delete` - Eliminar setlists
  - `event:view` - Ver eventos
  - `event:create` - Crear eventos
  - `event:edit` - Editar eventos
  - `event:delete` - Eliminar eventos
  - `direction:view` - Ver direcciones
  - `direction:create` - Crear direcciones
  - `direction:edit` - Editar direcciones
  - `direction:delete` - Eliminar direcciones
  - `user:view` - Ver usuarios

## Tipos de Permisos

### Canciones
- `song:view` - Ver canciones
- `song:create` - Crear canciones
- `song:edit` - Editar canciones
- `song:delete` - Eliminar canciones

### Setlists
- `setlist:view` - Ver setlists
- `setlist:create` - Crear setlists
- `setlist:edit` - Editar setlists
- `setlist:delete` - Eliminar setlists

### Eventos
- `event:view` - Ver eventos
- `event:create` - Crear eventos
- `event:edit` - Editar eventos
- `event:delete` - Eliminar eventos

### Dirección
- `direction:view` - Ver direcciones
- `direction:create` - Crear direcciones
- `direction:edit` - Editar direcciones
- `direction:delete` - Eliminar direcciones

### Usuarios
- `user:view` - Ver usuarios
- `user:create` - Crear usuarios
- `user:edit` - Editar usuarios
- `user:delete` - Eliminar usuarios

### Roles
- `role:view` - Ver roles
- `role:create` - Crear roles
- `role:edit` - Editar roles
- `role:delete` - Eliminar roles

## Uso en Controladores

### Ejemplo de uso del decorador @Roles

```typescript
import { Roles } from '../auth/roles.decorator';
import { PermissionType } from '../rols/schema/rol.schema';

@Controller('songs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SongsController {
  @Get()
  @Roles(PermissionType.SONG_VIEW)
  findAll() {
    return this.songsService.findAll();
  }

  @Post()
  @Roles(PermissionType.SONG_CREATE)
  create(@Body() data: CreateSongDto) {
    return this.songsService.create(data);
  }
}
```

## API Endpoints

### Roles
- `GET /roles` - Obtener todos los roles
- `GET /roles/:id` - Obtener un rol específico
- `POST /roles` - Crear un nuevo rol
- `PATCH /roles/:id` - Actualizar un rol
- `DELETE /roles/:id` - Eliminar un rol
- `POST /roles/predefined` - Crear roles predefinidos

### Direcciones
- `GET /directions` - Obtener todas las direcciones
- `GET /directions/:id` - Obtener una dirección específica
- `POST /directions` - Crear una nueva dirección
- `PATCH /directions/:id` - Actualizar una dirección
- `DELETE /directions/:id` - Eliminar una dirección
- `GET /directions?directorId=:id` - Obtener direcciones por director
- `GET /directions?startDate=:date&endDate=:date` - Obtener direcciones por rango de fechas

## Configuración de Usuarios

Los usuarios ahora tienen un campo `roleId` que hace referencia al rol asignado. Al crear un usuario, se debe especificar el `roleId` correspondiente.

## Inicialización

El sistema se inicializa automáticamente al arrancar la aplicación, creando los roles predefinidos si no existen.

## Seguridad

- Todos los endpoints están protegidos con autenticación JWT
- El control de acceso se realiza mediante guards que verifican los permisos del usuario
- Los permisos se validan en cada request basándose en el rol del usuario autenticado
