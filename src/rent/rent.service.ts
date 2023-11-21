import { Injectable } from '@nestjs/common';
import { Rent } from './entities/rent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private rentRepository: Repository<Rent>,
  ) {}

  async save(createRentDto: any /*CreateRentDto*/) {
    const rentSaved = await this.rentRepository.save(createRentDto);
    return rentSaved;
  }
}
