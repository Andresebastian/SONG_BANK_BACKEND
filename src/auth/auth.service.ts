// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolService } from '../rols/rol.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolService: RolService,
  ) {}

  async register(dto: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }) {
    const user = await this.usersService.create(dto);
    const { password, ...result } = user.toObject ? user.toObject() : user;

    const payload = {
      userId: (user as any)._id,
      email: user.email,
      roleId: user.roleId,
    };
    const token = this.jwtService.sign(payload);

    return {
      user: result,
      access_token: token,
    };
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new Error('Credenciales inválidas');

    const valid = await this.usersService.validatePassword(user, pass);
    if (!valid) throw new Error('Credenciales inválidas');

    const { password, ...result } = user;

    const payload = {
      userId: (user as any)._id,
      email: user.email,
      roleId: user.roleId,
    };
    const token = this.jwtService.sign(payload);

    return {
      user: result,
      access_token: token,
    };
  }
}
