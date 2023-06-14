import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordHashService } from 'src/auth/password-hash/password-hash.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private passwordHashService: PasswordHashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const username = await this.findUsername(createUserDto.username);
    const email = await this.findEmail(createUserDto.email);
    if (username !== null) {
      throw new ForbiddenException(
        'Пользователь с таким логином уже зарегистрирован',
      );
    }
    if (email) {
      throw new ForbiddenException(
        'Пользователь с такой почтой уже зарегистрирован',
      );
    }
    const user = this.usersRepository.create(createUserDto);
    user.password = await this.passwordHashService.createHash(user.password);
    return await this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findMany(user: { query: any }): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ username: user.query }, { email: user.query }],
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordHashService.createHash(
        updateUserDto.password,
      );
    }
    if (updateUserDto.username) {
      const username = await this.findUsername(updateUserDto.username);
      if (username !== null && username.id !== id) {
        throw new ForbiddenException(
          'Пользователь с таким логином уже зарегистрирован',
        );
      }
    }
    if (updateUserDto.email) {
      const email = await this.findEmail(updateUserDto.email);
      if (email !== null && email.id !== id) {
        throw new ForbiddenException(
          'Пользователь с такой почтой уже зарегистрирован',
        );
      }
    }
    await this.usersRepository.update({ id }, updateUserDto);
    const updatedUser = await this.findOne(id);
    delete updatedUser.password;
    return updatedUser;
  }

  async findUsername(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async findEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async removeOne(id: number): Promise<void> {
    await this.usersRepository.delete({ id });
  }
}
