import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rol } from './schema/rol.schema';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { PREDEFINED_ROLES } from './schema/rol.schema';

@Injectable()
export class RolService {
  constructor(@InjectModel(Rol.name) private rolModel: Model<Rol>) {}

  async create(createRolDto: CreateRolDto, userId: string): Promise<Rol> {
    // Verificar si ya existe un rol con el mismo nombre
    const existingRol = await this.rolModel.findOne({ name: createRolDto.name });
    if (existingRol) {
      throw new ConflictException('Ya existe un rol con este nombre');
    }

    const rol = new this.rolModel({
      ...createRolDto,
      createdBy: userId,
    });

    return rol.save();
  }

  async findAll(): Promise<Rol[]> {
    return this.rolModel.find({ active: true }).exec();
  }

  async findOne(id: string): Promise<Rol> {
    const rol = await this.rolModel.findById(id).exec();
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    return rol;
  }

  async update(id: string, updateRolDto: UpdateRolDto, userId: string): Promise<Rol> {
    // Verificar si el rol existe
    const existingRol = await this.rolModel.findById(id);
    if (!existingRol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Si se está cambiando el nombre, verificar que no exista otro rol con ese nombre
    if (updateRolDto.name && updateRolDto.name !== existingRol.name) {
      const duplicateRol = await this.rolModel.findOne({ 
        name: updateRolDto.name,
        _id: { $ne: id }
      });
      if (duplicateRol) {
        throw new ConflictException('Ya existe un rol con este nombre');
      }
    }

    const updatedRol = await this.rolModel.findByIdAndUpdate(
      id,
      { ...updateRolDto, updatedBy: userId },
      { new: true }
    ).exec();

    if (!updatedRol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return updatedRol;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rolModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    ).exec();

    if (!result) {
      throw new NotFoundException('Rol no encontrado');
    }
  }

  async createPredefinedRoles(userId: string): Promise<void> {
    for (const roleKey of Object.keys(PREDEFINED_ROLES)) {
      const roleData = PREDEFINED_ROLES[roleKey];
      
      // Verificar si el rol ya existe
      const existingRol = await this.rolModel.findOne({ name: roleData.name });
      if (!existingRol) {
        await this.rolModel.create({
          name: roleData.name,
          description: `Rol predefinido: ${roleData.name}`,
          permissions: roleData.permissions,
          createdBy: userId,
        });
      }
    }
  }

  async getPermissionsByRole(roleId: string): Promise<string[]> {
    const rol = await this.findOne(roleId);
    return rol.permissions;
  }

  async hasPermission(roleId: string, permission: string): Promise<boolean> {
    const permissions = await this.getPermissionsByRole(roleId);
    return permissions.includes(permission);
  }
}
