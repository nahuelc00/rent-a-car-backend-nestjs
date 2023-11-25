/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { CarsService } from 'src/cars/cars.service';
import { ClientService } from 'src/client/client.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { mapRentToDb } from './mappers/map-rent-to-db';
import { mapRentFromDb } from './mappers/map-rent-from-db';
import { UpdateRentDto } from './dto/update-rent-dto';
import { UserService } from 'src/user/user.service';

const jwt = require('jsonwebtoken');

@Controller('rent')
export class RentController {
  constructor(
    private readonly rentService: RentService,
    private readonly carsService: CarsService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getRents(
    @Res() response,
    @Req() req: Request & { headers: { authorization: string } },
  ) {
    try {
      const tokenAuth = req.headers.authorization;
      const decoded = jwt.verify(tokenAuth, process.env.PRIVATE_KEY_JWT);
      const user = await this.userService.getById(Number(decoded.id));
      const isUserAdmin = user.roles.includes('admin');

      if (isUserAdmin) {
        const rents = await this.rentService.getAll();
        const rentsMapped = rents.map(mapRentFromDb);
        response.status(HttpStatus.OK).send(rentsMapped);
      } else {
        response.status(HttpStatus.UNAUTHORIZED).send({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Only for admin user',
        });
      }
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
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

  @Put()
  async updateRent(@Res() response, @Body() updateRentDto: UpdateRentDto) {
    try {
      const carLicensePlate = updateRentDto.carLicensePlate;
      const clientDni = updateRentDto.dniClient;
      const rentId = Number(updateRentDto.id);

      const car = await this.carsService.getByLicensePlate(carLicensePlate);
      const client = await this.clientService.getByDni(clientDni);

      const rentToUpdate = mapRentToDb({
        carId: car.id,
        clientId: client.id,
        ...updateRentDto,
      });

      const resultRentUpdated = await this.rentService.update(
        rentId,
        rentToUpdate,
      );

      const isRentNotFound = resultRentUpdated.affected === 0;

      if (isRentNotFound) {
        response.status(HttpStatus.NOT_FOUND).send({
          message: 'Rent not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      response.status(HttpStatus.OK).send(resultRentUpdated);
    } catch (e) {
      throw new HttpException(
        'Fail to update. Check the credentials.',
        HttpStatus.CONFLICT,
      );
    }
  }

  @Delete(':id')
  async removeRent(@Res() response, @Param('id') id: string) {
    try {
      const resultRentDeleted = await this.rentService.remove(Number(id));
      const isRentNotFound = resultRentDeleted.affected === 0;

      if (isRentNotFound) {
        response.status(HttpStatus.NOT_FOUND).send({
          message: 'Rent not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      response.status(HttpStatus.OK).send(resultRentDeleted);
    } catch (error) {
      throw new HttpException('Fail at delete rent', HttpStatus.BAD_REQUEST);
    }
  }
}
