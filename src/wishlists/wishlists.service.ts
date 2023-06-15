import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateWishlistDto } from './dto/CreateWishlistDto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishlistDto } from './dto/UpdateWishlistDto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(
    createWishListDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const items = await this.wishesService.findMany(createWishListDto.itemsId);

    const wishList = this.wishListsRepository.create({
      ...createWishListDto,
      items,
      owner: user,
    });

    return await this.wishListsRepository.save(wishList);
  }

  async findMany(): Promise<Wishlist[]> {
    return await this.wishListsRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishListsRepository.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });
    delete wishlist.owner.password;
    delete wishlist.owner.email;
    return wishlist;
  }

  async updateOne(
    user: User,
    updateWishlistDto: UpdateWishlistDto,
    wishlistId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(wishlistId);
    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException(
        'Вы не можете изменить список желаний другого пользователя',
      );
    }
    const wishes = await this.wishesService.findMany(updateWishlistDto.itemsId);

    return await this.wishListsRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      items: wishes,
    });
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.findOne(wishlistId);
    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException(
        'Вы не можете удалить список желаний другого пользователя',
      );
    }
    await this.wishListsRepository.delete(wishlistId);
    return wishlist;
  }
}
