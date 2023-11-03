import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Car } from './cars/entities/car.entity';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const CONFIG_DB_PRODUCTION: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: Number(process.env.POSTGRESQL_PORT),
  username: process.env.POSTGRESQL_USERNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DATABASE,
  entities: [User, Car],
  synchronize: true,
};

const CONFIG_DB_DEVELOPMENT: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database/database.db',
  entities: [Car, User],
  synchronize: true,
};

export { CONFIG_DB_PRODUCTION, CONFIG_DB_DEVELOPMENT };
