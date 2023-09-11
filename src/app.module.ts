import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';
import { CarsController } from './cars/cars.controller';
import { CarsService } from './cars/cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './cars/entities/car.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cars.db',
      entities: [Car],
      synchronize: true,
    }),
    CarsModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class AppModule {}
