import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findUserById(id: number) {
    const user = await this.userRepo.findOne(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findUserByEmail(email: string) {
    const existEmail = await this.userRepo.findOne({ where: { email } });
    if (existEmail)
      throw new BadRequestException(
        `Ya existe un usuario con el email: ${email}`,
      );
  }

  async create(createUserDto: CreateUserDto) {
    await this.findUserByEmail(createUserDto.email);
    const newUser = this.userRepo.create(createUserDto);
    const userSaved = await this.userRepo.save(newUser);
    return {
      message: 'This action adds a new user',
      user: userSaved,
    };
  }

  async findAll() {
    const users = await this.userRepo.find();
    return {
      message: `This action returns all users`,
      users,
    };
  }

  async findOne(id: number) {
    const user = await this.findUserById(id);
    return {
      meesage: `This action returns a #${id} user`,
      user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    const mergeUser = this.userRepo.merge(user, updateUserDto);
    const updatedUser = await this.userRepo.save(mergeUser);

    return {
      message: `This action updates a #${id} user`,
      user: updatedUser,
    };
  }

  async remove(id: number) {
    const user = await this.findUserById(id);
    await this.userRepo.delete(id);
    return {
      message: `This action removes a #${id} user`,
      user,
    };
  }
}
