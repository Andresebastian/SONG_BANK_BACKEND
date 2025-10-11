import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RolService } from '../rols/rol.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private rolService: RolService,
  ) {}

  async create(userData: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }) {
    const exists = await this.findByEmail(userData.email);
    if (exists) throw new BadRequestException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new this.userModel({ ...userData, password: hashedPassword });
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async findDirectors(): Promise<User[]> {
    const allRoles = await this.rolService.findAll();
    const directorRoles = allRoles.filter((role) =>
      role.name.includes('Director'),
    );

    const directorRoleIds = directorRoles.map((role) =>
      (role as any)._id.toString(),
    );

    return this.userModel
      .find({
        roleId: { $in: directorRoleIds },
      })
      .populate('roleId', 'name')
      .exec();
  }
}
