import { Injectable } from '@nestjs/common';
import { Car } from './entities/car.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarToDbDto } from './dto/create-car-to-db.dto';
import { UpdateCarToDbDto } from './dto/update-car-to-db.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
  ) {}

  async getAll(): Promise<Car[]> {
    const cars: Car[] = await this.carsRepository.find();

    return cars;
  }

  async getById(id: number): Promise<Car> {
    const car: Car = await this.carsRepository.findOneBy({ id });

    return car;
  }

  async save(carToSave: CreateCarToDbDto): Promise<Car> {
    const carSaved: Car = await this.carsRepository.save(carToSave);
    return carSaved;
  }

  async update(
    id: number,
    carToUpdate: UpdateCarToDbDto,
  ): Promise<UpdateResult> {
    const resultCarUpdated: UpdateResult = await this.carsRepository.update(
      id,
      carToUpdate,
    );

    return resultCarUpdated;
  }

  async remove(id: number): Promise<DeleteResult> {
    const resultCarDeleted: DeleteResult = await this.carsRepository.delete(id);

    return resultCarDeleted;
  }
}
