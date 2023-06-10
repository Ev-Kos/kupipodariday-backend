import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateOfferDto } from './dto/CreateOfferDto';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({ relations: ['item', 'user'] });
  }

  findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOne({
      relations: {
        item: true,
        user: true,
      },
      where: { id },
    });
  }

  async create(user: User, offer: CreateOfferDto) {
    const wishes = await this.wishesService.findOne(offer.itemId);
    const { id } = user;
    const moneyDifference = wishes.price - wishes.raised;
    const wish = await this.wishesService.findOne(wishes.id);

    if (offer.amount > moneyDifference) {
      throw new BadRequestException(
        'Сумма взноса превышает сумму остатка стоимости подарка',
      );
    }

    await this.wishesService.update(offer.itemId, {
      raised: wishes.raised + offer.amount,
    });

    if (id === wishes.owner.id) {
      throw new BadRequestException(
        'Вы не можете вносить деньги на свои подарки',
      );
    }

    if (wishes.raised > 0 && wishes.price !== undefined) {
      throw new ConflictException(
        'Обновление запрещено, поскольку идёт сбор средств',
      );
    }
    return this.offerRepository.save({
      ...offer,
      user,
      item: wish,
    });
  }
}
