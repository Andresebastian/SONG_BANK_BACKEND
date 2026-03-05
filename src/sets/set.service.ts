import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Set } from './schema/set.schema';
import { CreateSetDto } from './dto/create-set.dto';

@Injectable()
export class SetsService {
  constructor(@InjectModel(Set.name) private setModel: Model<Set>) {}

  async create(data: CreateSetDto, userId: string): Promise<Set> {
    //await this.setModel.updateMany({}, { $set: { active: false } });

    // Crear fecha en zona horaria local para evitar problemas con UTC
    // Si recibimos '2025-10-11', debe ser el 11 de octubre, no el 10
    const [year, month, day] = data.date.split('-').map(Number);
    const setDate = new Date(year, month - 1, day); // month es 0-indexed

    // Generar título automático basado en la fecha si no se proporciona
    const title =
      data.title ||
      `Setlist - ${setDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;

    const newSet = new this.setModel({
      ...data,
      date: setDate,
      title,
      createdBy: userId,
      active: true,
    });
    return newSet.save();
  }

  async findActive(): Promise<Set | null> {
    return this.setModel
      .findOne({ active: true })
      .populate('songs.songId')
      .exec();
  }

  async findAll(): Promise<Set[]> {
    return this.setModel.find().populate('songs.songId').exec();
  }

  async update(id: string, data: Partial<CreateSetDto>): Promise<Set | null> {
    return this.setModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
