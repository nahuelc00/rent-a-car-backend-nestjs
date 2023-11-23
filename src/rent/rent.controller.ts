import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { CarsService } from 'src/cars/cars.service';
import { ClientService } from 'src/client/client.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { mapRentToDb } from './mappers/map-rent-to-db';
import { mapRentFromDb } from './mappers/map-rent-from-db';

@Controller('rent')
export class RentController {
  constructor(
    private readonly rentService: RentService,
    private readonly carsService: CarsService,
    private readonly clientService: ClientService,
  ) {}

  @Get()
  async getRents() {
    const rents = await this.rentService.getAll();
    const rentsMapped = rents.map((rent) => mapRentFromDb(rent));

    return rentsMapped;
  }

  @Post()
  async saveRent(@Body() createRentDto: CreateRentDto) {
    try {
      const carLicensePlate = createRentDto.carLicensePlate;
      const clientDni = createRentDto.dniClient;

      const car = await this.carsService.getByLicensePlate(carLicensePlate);
      const client = await this.clientService.getByDni(clientDni);

      const rentToSave = mapRentToDb({
        carId: car.id,
        clientId: client.id,
        ...createRentDto,
      });

      const rentSaved = await this.rentService.save(rentToSave);

      const rentMappedFromDb = mapRentFromDb(rentSaved);

      return rentMappedFromDb;
    } catch (error) {
      throw new HttpException(
        'Check the rentals. It is likely that there is already a rental registered with these credentials.',
        HttpStatus.CONFLICT,
      );
    }
  }
}
