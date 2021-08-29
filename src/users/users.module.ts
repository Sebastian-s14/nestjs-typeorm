import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ModulesModule } from 'src/modules/modules.module';

@Module({
  imports: [ModulesModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
