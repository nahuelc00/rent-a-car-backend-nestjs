import { Controller, Post, Body } from '@nestjs/common';
import { RentService } from './rent.service';
import { CarsService } from 'src/cars/cars.service';
import { ClientService } from 'src/client/client.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { mapRentToDb } from './mappers/map-rent-to-db';

@Controller('rent')
export class RentController {
  constructor(
    private readonly rentService: RentService,
    private readonly carsService: CarsService,
    private readonly clientService: ClientService,
  ) {}

  @Post()
  async saveRent(@Body() createRentDto: CreateRentDto) {
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

    return rentSaved;
  }
}
