import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Car } from './cars/entities/car.entity';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const CONFIG_DB_PRODUCTION: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
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
