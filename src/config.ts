import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Car } from './cars/entities/car.entity';
import { Client } from './client/entities/client.entity';
import { Rent } from './rent/entities/rent.entity';

const CONFIG_DB_PRODUCTION: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: Number(process.env.POSTGRESQL_PORT),
  username: process.env.POSTGRESQL_USERNAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DATABASE,
  entities: [User, Car, Client, Rent],
  synchronize: false,
};

const CONFIG_DB_DEVELOPMENT: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgresdb',
  port: Number(process.env.POSTGRES_PORT),
  username: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  database: 'postgres',
  entities: [User, Car, Client, Rent],
  synchronize: true,
};

const CONFIG_DB_UNIT_TESTING: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [Car, User, Client, Rent],
  synchronize: true,
};

const CONFIG_DB_TEST_E2E: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database/test-e2e.db',
  entities: [Car, User, Client, Rent],
  synchronize: true,
};

function assignDatabaseConfig(NODE_ENV: string) {
  if (NODE_ENV === 'production') return CONFIG_DB_PRODUCTION;
  if (NODE_ENV === 'development') return CONFIG_DB_DEVELOPMENT;
  if (NODE_ENV === 'testing') return CONFIG_DB_UNIT_TESTING;
  if (NODE_ENV === 'test-e2e') return CONFIG_DB_TEST_E2E;
}

export { assignDatabaseConfig };
