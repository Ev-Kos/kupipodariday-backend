import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersController } from './users.controller';
import { HashModule } from 'src/auth/hash/hash.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), WishesModule, HashModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
