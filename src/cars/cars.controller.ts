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
  UploadedFile,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { assignImageUrlByEnvironment } from './utilities';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getCars() {
    const cars: Car[] = await this.carsService.getAll();
    const carsMapped: ICarMappedFromDb[] = cars.map((car) => mapEntity(car));

    return carsMapped;
  }

  @Get(':id')
  async getCar(@Param('id') id: string) {
    const car: Car = await this.carsService.getById(Number(id));
    const isCarNotFound = car === null;

    if (isCarNotFound)
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);

    const carMapped: ICarMappedFromDb = mapEntity(car);
    return carMapped;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
    }),
  )
  async saveCar(
    @UploadedFile() file: Express.Multer.File,
    @Body() carToSave: CreateCarDto,
  ) {
    const car = await this.carsService.getByLicensePlate(
      carToSave.licensePlate,
    );
    const isCarExistent = car !== null;

    if (isCarExistent)
      throw new HttpException('This car already exists', HttpStatus.CONFLICT);

    try {
      const imageUrl = assignImageUrlByEnvironment(file.filename);

      const carToDb: ICarMappedToDb = mapEntityToDb({ ...carToSave, imageUrl });

      const carSaved: Car = await this.carsService.save(carToDb);

      const carMapped = mapEntity(carSaved);

      return carMapped;
    } catch (error) {
      throw new HttpException('Fail at save car', HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
    }),
  )
  async updateCar(
    @Body() carToUpdate: UpdateCarDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const imageUrl = assignImageUrlByEnvironment(file.filename);

      const carMappedToDb: ICarMappedToDb = mapEntityToDb({
        ...carToUpdate,
        imageUrl,
      });

      const resultCarUpdated: UpdateResult = await this.carsService.update(
        Number(carToUpdate.id),
        carMappedToDb,
      );

      return resultCarUpdated;
    } catch (error) {
      throw new HttpException('Fail at update car', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async removeCar(@Param('id') id: string) {
    try {
      const resultCarDeleted: DeleteResult = await this.carsService.remove(
        Number(id),
      );

      return resultCarDeleted;
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new HttpException('This car is rented', HttpStatus.CONFLICT);
      }
      throw new HttpException('Fail at delete car', HttpStatus.BAD_REQUEST);
    }
  }
}
