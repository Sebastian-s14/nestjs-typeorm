import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';

import { Type } from './entities/type.entity';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Type])],
  controllers: [TypesController],
  providers: [TypesService],
  exports: [TypesService, TypeOrmModule],
})
export class TypesModule {}
