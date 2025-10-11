import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Direction } from './schema/direction.schema';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';

@Injectable()
export class DirectionService {
  constructor(@InjectModel(Direction.name) private directionModel: Model<Direction>) {}

  async create(createDirectionDto: CreateDirectionDto, userId: string): Promise<Direction> {
    const direction = new this.directionModel({
      ...createDirectionDto,
      createdBy: userId,
    });

    return direction.save();
  }

  async findAll(): Promise<Direction[]> {
    return this.directionModel.find({ active: true }).populate('directorId', 'name email').populate('eventId', 'title').exec();
  }

  async findOne(id: string): Promise<Direction> {
    const direction = await this.directionModel.findById(id).populate('directorId', 'name email').populate('eventId', 'title').exec();
    if (!direction) {
      throw new NotFoundException('Dirección no encontrada');
    }
    return direction;
  }

  async update(id: string, updateDirectionDto: UpdateDirectionDto, userId: string): Promise<Direction> {
    const direction = await this.directionModel.findByIdAndUpdate(
      id,
      { ...updateDirectionDto, updatedBy: userId },
      { new: true }
    ).populate('directorId', 'name email').populate('eventId', 'title').exec();

    if (!direction) {
      throw new NotFoundException('Dirección no encontrada');
    }

    return direction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.directionModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    ).exec();

    if (!result) {
      throw new NotFoundException('Dirección no encontrada');
    }
  }

  async findByDirector(directorId: string): Promise<Direction[]> {
    return this.directionModel.find({ directorId, active: true }).populate('directorId', 'name email').populate('eventId', 'title').exec();
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Direction[]> {
    return this.directionModel.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      active: true
    }).populate('directorId', 'name email').populate('eventId', 'title').exec();
  }
}
