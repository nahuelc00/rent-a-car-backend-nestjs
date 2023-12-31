import { Injectable } from '@nestjs/common';
import { Rent } from './entities/rent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRentMappedToDb } from './interfaces/rent-mapped-to-db.interface';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private rentRepository: Repository<Rent>,
  ) {}

  async getAll(): Promise<Rent[]> {
    const rents = await this.rentRepository.find();
    return rents;
  }

  async save(createRentDto: IRentMappedToDb): Promise<Rent> {
    const rentSaved = await this.rentRepository.save(createRentDto);
    return rentSaved;
  }

  async update(id: number, carToUpdate: IRentMappedToDb) {
    const resultRentUpdated = await this.rentRepository.update(id, carToUpdate);

    return resultRentUpdated;
  }

  async remove(id: number) {
    const resultRentDeleted = await this.rentRepository.delete(id);

    return resultRentDeleted;
  }
}
