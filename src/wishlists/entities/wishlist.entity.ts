import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { IsDate, Length, IsUrl, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity({ schema: 'kupipodariday' })
export class Wishlist {
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
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  @IsOptional()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
