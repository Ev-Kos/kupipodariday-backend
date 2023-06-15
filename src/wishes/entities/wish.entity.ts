import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Length, IsUrl, IsNumber, IsInt } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/utils/base-entity';

@Entity({ schema: 'kupipodariday' })
export class Wish extends BaseEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  price: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsInt()
  copied: number;
}
