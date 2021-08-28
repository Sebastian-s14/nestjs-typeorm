import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from 'src/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const {
          user: username,
          password,
          dbName: database,
          host,
          port,
        } = configService.mysql;
        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
