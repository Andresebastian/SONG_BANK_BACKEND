import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// Definir los tipos de permisos disponibles
export enum PermissionType {
  // Permisos de canciones
  SONG_VIEW = 'song:view',
  SONG_CREATE = 'song:create',
  SONG_EDIT = 'song:edit',
  SONG_DELETE = 'song:delete',

  // Permisos de setlist
  SETLIST_VIEW = 'setlist:view',
  SETLIST_CREATE = 'setlist:create',
  SETLIST_EDIT = 'setlist:edit',
  SETLIST_DELETE = 'setlist:delete',

  // Permisos de eventos
  EVENT_VIEW = 'event:view',
  EVENT_CREATE = 'event:create',
  EVENT_EDIT = 'event:edit',
  EVENT_DELETE = 'event:delete',

  // Permisos de dirección
  DIRECTION_VIEW = 'direction:view',
  DIRECTION_CREATE = 'direction:create',
  DIRECTION_EDIT = 'direction:edit',
  DIRECTION_DELETE = 'direction:delete',

  // Permisos de usuarios
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',

  // Permisos de roles
  ROLE_VIEW = 'role:view',
  ROLE_CREATE = 'role:create',
  ROLE_EDIT = 'role:edit',
  ROLE_DELETE = 'role:delete',
}

// Definir los roles predefinidos con sus permisos
export const PREDEFINED_ROLES = {
  MUSICO: {
    name: 'Músico',
    permissions: [
      PermissionType.SONG_VIEW,
      PermissionType.SONG_EDIT,
      PermissionType.SETLIST_VIEW,
      PermissionType.EVENT_VIEW,
    ],
  },
  CORISTA: {
    name: 'Corista',
    permissions: [
      PermissionType.SONG_VIEW,
      PermissionType.SONG_EDIT,
      PermissionType.SETLIST_VIEW,
      PermissionType.EVENT_VIEW,
    ],
  },
  DIRECTOR_MUSICO: {
    name: 'Director/Músico',
    permissions: [
      PermissionType.SONG_VIEW,
      PermissionType.SONG_CREATE,
      PermissionType.SONG_EDIT,
      PermissionType.SONG_DELETE,
      PermissionType.SETLIST_VIEW,
      PermissionType.SETLIST_CREATE,
      PermissionType.SETLIST_EDIT,
      PermissionType.SETLIST_DELETE,
      PermissionType.EVENT_VIEW,
      PermissionType.EVENT_CREATE,
      PermissionType.EVENT_EDIT,
      PermissionType.EVENT_DELETE,
      PermissionType.DIRECTION_VIEW,
      PermissionType.DIRECTION_CREATE,
      PermissionType.DIRECTION_EDIT,
      PermissionType.DIRECTION_DELETE,
      PermissionType.USER_VIEW,
    ],
  },
  DIRECTOR_CORISTA: {
    name: 'Director/Corista',
    permissions: [
      PermissionType.SONG_VIEW,
      PermissionType.SONG_CREATE,
      PermissionType.SONG_EDIT,
      PermissionType.SONG_DELETE,
      PermissionType.SETLIST_VIEW,
      PermissionType.SETLIST_CREATE,
      PermissionType.SETLIST_EDIT,
      PermissionType.SETLIST_DELETE,
      PermissionType.EVENT_VIEW,
      PermissionType.EVENT_CREATE,
      PermissionType.EVENT_EDIT,
      PermissionType.EVENT_DELETE,
      PermissionType.DIRECTION_VIEW,
      PermissionType.DIRECTION_CREATE,
      PermissionType.DIRECTION_EDIT,
      PermissionType.DIRECTION_DELETE,
      PermissionType.USER_VIEW,
    ],
  },
};

@Schema({ timestamps: true })
export class Rol {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: [String],
    enum: Object.values(PermissionType),
  })
  permissions: PermissionType[];

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const RolSchema = SchemaFactory.createForClass(Rol);
