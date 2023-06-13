import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/auth/hash/hash.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    user.password = await this.hashService.generateHash(user.password);
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
    let password = updateUserDto.password;
    if (password) {
      password = await this.hashService.generateHash(password);
    }
    await this.usersRepository.update({ id }, updateUserDto);
    return await this.findOne(id);
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
        wishlists: true,
      },
    });
  }

  async removeOne(id: number): Promise<void> {
    await this.usersRepository.delete({ id });
  }
}
