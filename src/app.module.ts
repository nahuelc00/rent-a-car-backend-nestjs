import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CONFIG_DB_DEVELOPMENT, CONFIG_DB_PRODUCTION } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'development'
        ? CONFIG_DB_DEVELOPMENT
        : CONFIG_DB_PRODUCTION,
    ),
    ServeStaticModule.forRoot({
      rootPath: 'uploads',
    }),
    CarsModule,
    UserModule,
  ],
})
export class AppModule {}
