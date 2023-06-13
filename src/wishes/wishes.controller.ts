import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/CreateWishDto';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/UpdateWishDto';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto): Promise<Wish> {
    return this.wishesService.create(req.user, createWishDto);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.copyWish(id, req.user);
  }

  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishesService.updateOne(+id, updateWishDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    return this.wishesService.remove(id, req.user.id);
  }
}
