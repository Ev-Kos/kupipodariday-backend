/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHashService } from './password-hash/password-hash.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private passwordHashService: PasswordHashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUsername(username);
    const validPassword = await this.passwordHashService.validPassword(
      password,
      user.password,
    );
    if (user) {
      if (validPassword) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new UnauthorizedException('Неверное имя пользователя или пароль');
      }
    }
    return null;
  }
}
