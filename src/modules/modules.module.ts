import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module as Module1 } from './entities/module.entity';

import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Module1])],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService, TypeOrmModule],
})
export class ModulesModule {}
