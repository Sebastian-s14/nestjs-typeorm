import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Module } from 'src/modules/entities/module.entity';

import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
  ) {}

  async findModuleById(id: number, withRelations?: boolean) {
    let module = {} as Module;
    module = await this.moduleRepo.findOne(id);
    if (!module)
      throw new NotFoundException(`Módulo con el id: #${id} no encontrado`);
    if (withRelations)
      module = await this.moduleRepo.findOne(id, { relations: ['users'] });
    return module;
  }

  async findModuleByName(name: string, id?: number) {
    const existName = await this.moduleRepo.findOne({ where: { name } });
    if (existName && existName.id !== id)
      throw new BadRequestException(
        `Ya existe un modulo con el nombre: ${name}`,
      );
  }

  async create(createModuleDto: CreateModuleDto) {
    await this.findModuleByName(createModuleDto.name);
    const newModule = this.moduleRepo.create(createModuleDto);
    const moduleSaved = await this.moduleRepo.save(newModule);
    return {
      message: 'This action adds a new module',
      module: moduleSaved,
    };
  }

  async findAll() {
    const modules = await this.moduleRepo.find();
    return {
      message: `This action returns all modules`,
      modules,
    };
  }

  async findOne(id: number) {
    const module = await this.findModuleById(id);
    return {
      message: `This action returns a #${id} module`,
      module,
    };
  }

  async getUserByModule(id: number) {
    const module = await this.findModuleById(id, true);
    return {
      message: `Usuarios con el módulo #${id}`,
      module,
    };
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    const module = await this.findModuleById(id);
    await this.findModuleByName(updateModuleDto.name, id);
    const mergeModule = this.moduleRepo.merge(module, updateModuleDto);
    const updatedModule = await this.moduleRepo.save(mergeModule);
    return {
      message: `This action updates a #${id} module`,
      module: updatedModule,
    };
  }

  async remove(id: number) {
    const module = await this.findModuleById(id);
    await this.moduleRepo.delete(id);
    return {
      message: `This action removes a #${id} module`,
      module,
    };
  }
}
