import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './entities/rent.entity';
import { CarsService } from 'src/cars/cars.service';
import { ClientService } from 'src/client/client.service';
import { Car } from 'src/cars/entities/car.entity';
import { Client } from 'src/client/entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rent, Car, Client, User])],
  controllers: [RentController],
  providers: [RentService, CarsService, ClientService, UserService],
  exports: [TypeOrmModule],
})
export class RentModule {}
