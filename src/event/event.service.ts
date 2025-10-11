// event.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from './schema/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(dto: CreateEventDto, userId: string) {
    const user = await this.userModel.findById(dto.directorId);
    if (!user) return { error: 'Id de director no encontrado' };

    // Crear fecha en zona horaria local para evitar problemas con UTC
    const [year, month, day] = dto.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);

    const directorName = user.name;
    const directorId = new Types.ObjectId(dto.directorId);

    return this.eventModel.create({
      ...dto,
      date: eventDate,
      setId: new Types.ObjectId(dto.setId),
      createdBy: new Types.ObjectId(userId),
      directorName,
      directorId,
    });
  }

  async findAllActive() {
    return this.eventModel.find({ status: 'active' }).populate('setId').exec();
  }

  async findAll() {
    return this.eventModel.find().populate('setId').exec();
  }

  async findOne(id: string) {
    return this.eventModel.findById(id).populate('setId').exec();
  }

  async update(id: string, dto: Partial<CreateEventDto>) {
    return this.eventModel
      .findByIdAndUpdate(id, { ...dto }, { new: true })
      .populate('setId')
      .exec();
  }

  async remove(id: string) {
    return this.eventModel.findByIdAndDelete(id).populate('setId').exec();
  }
}
