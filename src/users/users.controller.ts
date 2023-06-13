import {
  Controller,
  Patch,
  Body,
  Post,
  Req,
  Get,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Wish } from '../wishes/entities/wish.entity';
import { JwtGuard } from 'src/guards/jwt.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/UpdateUserDto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @Post('find')
  public async findMany(@Body() user): Promise<User[]> {
    return this.usersService.findMany(user);
  }

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':username')
  async getUserByName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  @Get('me/wishes')
  getWishesUser(@Req() req): Promise<Wish[]> {
    const { id } = req.user;
    return this.wishesService.findWishesByUserId(id);
  }

  @Get(':username/wishes')
  async findWishesByUserName(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    const wish = await this.wishesService.findWishesByUserId(user.id);
    return wish;
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() updateUser: UpdateUserDto) {
    const { id } = req.user;
    return this.usersService.updateOne(id, updateUser);
  }
}
