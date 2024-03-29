import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { Module } from 'src/modules/entities/module.entity';
import { TypesService } from 'src/types/types.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { Type } from 'src/types/entities/type.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
    // @InjectRepository(Module) private typeRepo: Repository<Type>,
    private typeService: TypesService,
  ) {}

  async findUserById(id: number, withRelations?: boolean) {
    let user = {} as User;
    user = await this.userRepo.findOne(id);
    if (!user) throw new NotFoundException(`User #${id} not found`);

    if (withRelations)
      user = await this.userRepo.findOne(id, {
        relations: ['modules', 'type'],
      });
    return user;
  }

  async findUserByEmail(email: string, id?: number, returnUser?: boolean) {
    const existUser = await this.userRepo.findOne({ where: { email } });
    // console.log('existUser');
    // console.log(existUser);
    // console.log(!!existUser);

    if (returnUser && !existUser)
      throw new BadRequestException(`No existe un usuario con el : ${email}`);

    if (returnUser) return existUser;

    if (existUser && existUser.id !== id)
      throw new BadRequestException(
        `Ya existe un usuario con el email: ${email}`,
      );
  }

  async create(createUserDto: CreateUserDto) {
    await this.findUserByEmail(createUserDto.email);
    const newUser = this.userRepo.create(createUserDto);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;

    if (createUserDto.typeId) {
      // const type = await this.typeRepo.findOne(createUserDto.typeId);
      const type = await this.typeService.findTypeById(createUserDto.typeId);
      newUser.type = type;
    }
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
    const users = await this.userRepo.find({ relations: ['modules', 'type'] });
    return {
      message: `This action returns all users`,
      users,
    };
  }

  async findOne(id: number) {
    const user = await this.findUserById(id, true);
    return {
      meesage: `This action returns a #${id} user`,
      user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    await this.findUserByEmail(updateUserDto.email, id);
    if (updateUserDto.typeId) {
      // const type = await this.typeRepo.findOne(createUserDto.typeId);
      const type = await this.typeService.findTypeById(updateUserDto.typeId);
      user.type = type;
    }
    if (updateUserDto.modulesIds) {
      const modules = await this.moduleRepo.findByIds(updateUserDto.modulesIds);
      user.modules = modules;
    }
    this.userRepo.merge(user, updateUserDto);
    const updatedUser = await this.userRepo.save(user);

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
