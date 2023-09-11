import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ICarMappedFromDb } from './interfaces/car-mapped-from-db.interface';
import { mapEntity } from './mappers/mapEntityFromDb';
import { mapEntityToDb } from './mappers/mapEntityToDb';
import { ICarMappedToDb } from './interfaces/car-mapped-to-db.interface';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getCars(): Promise<ICarMappedFromDb[]> {
    const cars: Car[] = await this.carsService.getAll();
    const carsMapped: ICarMappedFromDb[] = cars.map((car) => mapEntity(car));

    return carsMapped;
  }

  @Get(':id')
  async getCar(@Param('id') id: string): Promise<ICarMappedFromDb> {
    const car: Car = await this.carsService.getById(Number(id));
    const isCarNotFound = car === null;

    if (isCarNotFound)
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);

    const carMapped: ICarMappedFromDb = mapEntity(car);
    return carMapped;
  }

  @Post()
  async saveCar(@Body() carToSave: CreateCarDto): Promise<ICarMappedFromDb> {
    try {
      const carToDb: ICarMappedToDb = mapEntityToDb(carToSave);

      const carSaved: Car = await this.carsService.save(carToDb);
      const carMapped = mapEntity(carSaved);

      return carMapped;
    } catch (error) {
      throw new HttpException('Fail at save car', HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async updateCar(@Body() carToUpdate: UpdateCarDto): Promise<UpdateResult> {
    try {
      const carMappedToDb: ICarMappedToDb = mapEntityToDb(carToUpdate);

      const resultCarUpdated: UpdateResult = await this.carsService.update(
        Number(carToUpdate.id),
        carMappedToDb,
      );

      const isCarNotFound = resultCarUpdated.affected === 0;

      if (isCarNotFound) throw new Error();

      return resultCarUpdated;
    } catch (error) {
      throw new HttpException('Fail at update car', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async removeCar(@Param('id') id: string): Promise<DeleteResult> {
    try {
      const resultCarDeleted: DeleteResult = await this.carsService.remove(
        Number(id),
      );

      const isCarNotFound = resultCarDeleted.affected === 0;

      if (isCarNotFound) throw new Error();

      return resultCarDeleted;
    } catch (error) {
      throw new HttpException('Fail at delete car', HttpStatus.BAD_REQUEST);
    }
  }
}
