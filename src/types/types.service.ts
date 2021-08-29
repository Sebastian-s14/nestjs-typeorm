import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Type } from 'src/types/entities/type.entity';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypesService {
  constructor(@InjectRepository(Type) private typeRepo: Repository<Type>) {}

  async findTypeById(id: number) {
    const type = await this.typeRepo.findOne(id);
    if (!type)
      throw new NotFoundException(`Tipo con el id: #${id} no encontrado`);

    return type;
  }

  async findTypeByName(name: string, id?: number) {
    const existName = await this.typeRepo.findOne({ where: { name } });
    if (existName && existName.id !== id)
      throw new BadRequestException(`Ya existe un tipo con el nombre: ${name}`);
  }

  async create(createTypeDto: CreateTypeDto) {
    await this.findTypeByName(createTypeDto.name);
    const newType = this.typeRepo.create(createTypeDto);
    const typeSaved = await this.typeRepo.save(newType);
    return {
      message: 'This action adds a new type',
      type: typeSaved,
    };
  }

  async findAll() {
    const types = await this.typeRepo.find();
    return {
      message: `This action returns all types`,
      types,
    };
  }

  async findOne(id: number) {
    const type = await this.findTypeById(id);
    return {
      message: `This action returns a #${id} type`,
      type,
    };
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const type = await this.findTypeById(id);
    await this.findTypeByName(updateTypeDto.name, id);
    const mergeType = this.typeRepo.merge(type, updateTypeDto);
    const updatedType = await this.typeRepo.save(mergeType);
    return {
      message: `This action updates a #${id} type`,
      typr: updatedType,
    };
  }

  async remove(id: number) {
    const type = await this.findTypeById(id);
    await this.typeRepo.delete(id);
    return {
      message: `This action removes a #${id} type`,
      type,
    };
  }
}
