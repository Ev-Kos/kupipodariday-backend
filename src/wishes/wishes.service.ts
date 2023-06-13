import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository, MoreThan, UpdateResult, In } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateWishDto } from './dto/CreateWishDto';
import { UpdateWishDto } from './dto/UpdateWishDto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  findAll() {
    return this.wishesRepository.find();
  }

  async create(owner: User, createWishDto: CreateWishDto) {
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: owner,
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      where: {
        copied: MoreThan(0),
      },
      take: 10,
    });
  }

  async findOne(wishId: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      relations: {
        owner: {
          wishes: true,
          wishlists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }

  findWishesByUserId(userId: number) {
    return this.wishesRepository.find({
      where: { owner: { id: userId } },
      relations: {
        owner: {
          wishes: true,
          wishlists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }

  async updateOne(wishId: number, updatedWish: UpdateWishDto, userId: number) {
    const wish = await this.findOne(wishId);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException(
        'Вы не можете изменить желание другого пользователя',
      );
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ConflictException(
        'Обновление запрещено, поскольку идёт сбор средств',
      );
    }
    return await this.wishesRepository.update(wishId, updatedWish);
  }

  async updateByRised(id: number, newRised: number): Promise<UpdateResult> {
    return await this.wishesRepository.update({ id: id }, { raised: newRised });
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException(
        'Вы не можете удалить желание другого пользователя',
      );
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ConflictException(
        'Удаление запрещено, поскольку идёт сбор средств',
      );
    }
    await this.wishesRepository.delete(wishId);
    return wish;
  }

  findMany(items: number[]): Promise<Wish[]> {
    return this.wishesRepository.findBy({ id: In(items) });
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne(wishId);
    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Это желание уже есть в вашем списке');
    }
    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });

    const wishCopy = {
      ...wish,
      raised: 0,
      owner: user.id,
      offers: [],
    };
    await this.create(user, wishCopy);
    return {};
  }
}
