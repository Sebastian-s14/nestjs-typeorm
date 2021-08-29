import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Module } from 'src/modules/entities/module.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
  ) {}

  async findUserById(id: number) {
    const user = await this.userRepo.findOne(id, { relations: ['modules'] });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findUserByEmail(email: string, id?: number) {
    const existEmail = await this.userRepo.findOne({ where: { email } });
    if (existEmail && existEmail.id !== id)
      throw new BadRequestException(
        `Ya existe un usuario con el email: ${email}`,
      );
  }

  async create(createUserDto: CreateUserDto) {
    await this.findUserByEmail(createUserDto.email);
    const newUser = this.userRepo.create(createUserDto);
    if (createUserDto.modulesIds) {
      const modules = await this.moduleRepo.findByIds(createUserDto.modulesIds);
      newUser.modules = modules;
    }
    const userSaved = await this.userRepo.save(newUser);
    return {
      message: 'This action adds a new user',
      user: userSaved,
    };
  }

  async findAll() {
    const users = await this.userRepo.find({ relations: ['modules'] });
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
    await this.findUserByEmail(updateUserDto.email, id);
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

  // add one module
  async addModuleToUser(userId: number, moduleId: number) {
    const user = await this.findUserById(userId);
    const module = await this.moduleRepo.findOne(moduleId);
    user.modules.push(module);
    const savedUser = await this.userRepo.save(user);
    return {
      message: `Module con el id: ${moduleId} agregado correctamente al user con id: ${userId}`,
      user: savedUser,
    };
  }

  // remove one module
  async removeModuleByUser(userId: number, moduleId: number) {
    const user = await this.findUserById(userId);
    const existModule = user.modules.find((module) => module.id === moduleId);
    if (!existModule) {
      throw new BadRequestException(
        `El módulo con el id ${moduleId} no exise en el usuario con id ${userId}`,
      );
    }
    user.modules = user.modules.filter((item) => item.id !== moduleId);
    const userSaved = await this.userRepo.save(user);
    return {
      message: `Módulo con el id: ${moduleId} removido correctamente del user con id: ${userId}`,
      user: userSaved,
    };
  }
}
