import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './cars/entities/car.entity';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/cars.db',
      entities: [Car],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database/users.db',
      name: 'users',
      entities: [User],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'uploads',
    }),
    CarsModule,
    UserModule,
  ],
})
export class AppModule {}
