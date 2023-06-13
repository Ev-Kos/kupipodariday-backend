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
import { WishlistsService } from './wishlists.service';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { CreateWishlistDto } from './dto/CreateWishlistDto';
import { UpdateWishlistDto } from './dto/UpdateWishlistDto';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private wishlistsService: WishlistsService,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.wishlistsService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(+id);
  }

  @Post()
  async create(@Req() req, @Body() createWishListDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishListDto, req.user);
  }

  @Patch(':id')
  async updateOne(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.wishlistsService.updateOne(req.user.id, updateWishlistDto, +id);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    return await this.wishlistsService.remove(id, req.user.id);
  }
}
