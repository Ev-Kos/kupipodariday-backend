import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuthService]), WishesModule],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
