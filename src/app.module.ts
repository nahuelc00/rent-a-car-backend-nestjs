import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { CarsController } from './cars/cars.controller';
import { CarsService } from './cars/cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './cars/entities/car.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cars.db',
      entities: [Car],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'uploads',
    }),
    CarsModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class AppModule {}
