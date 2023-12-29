import { Injectable } from '@nestjs/common';
import { Car } from './entities/car.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICarMappedToDb } from './interfaces/car-mapped-to-db.interface';

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

  async getByLicensePlate(licensePlate: string): Promise<Car> {
    const car: Car = await this.carsRepository.findOneBy({
      license_plate: licensePlate,
    });

    return car;
  }

  async save(carToSave: ICarMappedToDb): Promise<Car> {
    const carSaved: Car = await this.carsRepository.save(carToSave);
    return carSaved;
  }

  async update(id: number, carToUpdate: ICarMappedToDb): Promise<UpdateResult> {
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

  async removeAll() {
    return await this.carsRepository.clear();
  }
}
