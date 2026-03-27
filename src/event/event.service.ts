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
    const previous = await this.eventModel.findById(id).select('status name').lean().exec();
    const updated = await this.eventModel
      .findByIdAndUpdate(id, { ...dto }, { new: true })
      .populate('setId')
      .exec();

    // Enviar notificación push cuando un evento pasa a estado "active"
    if (dto.status === 'active' && previous?.status !== 'active' && updated) {
      this.sendPushToAllUsers(
        '🎵 Nuevo setlist publicado',
        `"${updated.name}" ya está disponible`,
        { eventId: id },
      ).catch(() => {/* notificación no crítica, ignorar errores */});
    }

    return updated;
  }

  private async sendPushToAllUsers(
    title: string,
    body: string,
    data: Record<string, string>,
  ): Promise<void> {
    const users = await this.userModel
      .find({ pushToken: { $exists: true, $ne: null } })
      .select('pushToken')
      .lean()
      .exec();

    const tokens = users
      .map((u) => (u as any).pushToken as string)
      .filter((t) => t?.startsWith('ExponentPushToken'));

    if (tokens.length === 0) return;

    const messages = tokens.map((to) => ({ to, title, body, data, sound: 'default' }));

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(messages),
    });
  }

  async remove(id: string) {
    return this.eventModel.findByIdAndDelete(id).populate('setId').exec();
  }
}
