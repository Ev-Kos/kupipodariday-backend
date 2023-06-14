import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/CreateUserDto';
import { LocalGuard } from 'src/guards/local.guard';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    this.authService.auth(user);
    delete user.password;
    return user;
  }

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    const user = req.user;
    return this.authService.auth(user);
  }
}
