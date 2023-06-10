import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsDate, Length, IsUrl, IsNumber, IsInt } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ schema: 'kupipodariday' })
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

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

  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  raised: string;

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
