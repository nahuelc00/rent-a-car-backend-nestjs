import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { Car } from './entities/car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Client } from 'src/client/entities/client.entity';
import { Rent } from 'src/rent/entities/rent.entity';
import { assignDatabaseConfig } from 'src/config';
import { Readable } from 'typeorm/platform/PlatformTools';
import { CreateCarDto } from './dto/create-car.dto';
import * as mapperToDb from './mappers/mapEntityToDb';
import * as mapperFromDb from './mappers/mapEntityFromDb';
import { RentService } from 'src/rent/rent.service';
import { ClientService } from 'src/client/client.service';

describe('Cars controller', () => {
  let controller: CarsController;
  let rentService: RentService;
  let clientService: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
        TypeOrmModule.forFeature([Car, User, Client, Rent]),
      ],
      providers: [CarsService, RentService, ClientService],
      controllers: [CarsController],
    }).compile();

    controller = module.get<CarsController>(CarsController);
    rentService = module.get<RentService>(RentService);
    clientService = module.get<ClientService>(ClientService);
  });

  const carMockDto: CreateCarDto = {
    brand: 'Brand',
    year: 2023,
    color: 'Red',
    passengers: 4,
    model: 'Pepe',
    kilometers: 2345,
    licensePlate: 'AAA112',
    airConditioning: 'yes',
    transmission: 'automatic',
    unitPrice: 4000,
    totalPrice: 167000,
  };

  const multerFileMock: Express.Multer.File = {
    fieldname: 'fieldname',
    originalname: 'original',
    filename: 'filename',
    mimetype: 'mimetype',
    encoding: 'encoding',
    size: 100,
    destination: 'destination',
    path: 'path',
    buffer: Buffer.from('asd'),
    stream: Readable.from(Buffer.from('asd')),
  };

  it('Should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get cars', () => {
    it('Should get all cars', async () => {
      await controller.saveCar(multerFileMock, carMockDto);
      const cars = await controller.getCars();
      expect(cars.length).toBe(1);
    });
  });

  describe('Get car', () => {
    it('Should get a car by id', async () => {
      const carSaved = await controller.saveCar(multerFileMock, carMockDto);
      const car = await controller.getCar(String(carSaved.id));
      expect(car).toBeTruthy();
    });

    it('Should give error when trying get a car by id that not exist', async () => {
      try {
        await controller.getCar('1');
      } catch (error) {
        expect(error.response).toBe('Car not found');
      }
    });
  });

  describe('Save a car', () => {
    it('Should save a car, map it to the database and return the saved car mapped for the client', async () => {
      jest.spyOn(mapperToDb, 'mapEntityToDb');
      jest.spyOn(mapperFromDb, 'mapEntity');

      const carSaved = await controller.saveCar(multerFileMock, carMockDto);

      expect(carSaved.id).toBe(1);
      expect(mapperToDb.mapEntityToDb).toHaveBeenCalledTimes(1);
      expect(mapperFromDb.mapEntity).toHaveBeenCalledTimes(1);
    });

    it('Should give error when trying to save a car that already exists', async () => {
      await controller.saveCar(multerFileMock, carMockDto);

      try {
        await controller.saveCar(multerFileMock, carMockDto);
      } catch (error) {
        expect(error.response).toBe('This car already exists');
      }
    });
  });

  describe('Update a car', () => {
    it('Should update a car, map it to the database and return the result of update', async () => {
      jest.clearAllMocks();
      jest.spyOn(mapperToDb, 'mapEntityToDb');

      const carSaved = await controller.saveCar(multerFileMock, carMockDto);

      const updateCarDtoMock = { id: String(carSaved.id), ...carMockDto };

      const resultOfUpdate = await controller.updateCar(
        updateCarDtoMock,
        multerFileMock,
      );

      expect(resultOfUpdate.affected).toBe(1);
      expect(mapperToDb.mapEntityToDb).toHaveBeenCalledTimes(2);
    });

    it('Should return that not affected a car when trying to update a car that not exists', async () => {
      const updateCarDtoMock = { id: String(0), ...carMockDto };
      const resultOfUpdate = await controller.updateCar(
        updateCarDtoMock,
        multerFileMock,
      );
      expect(resultOfUpdate.affected).toBe(0);
    });

    it('Should return a exception when trying to update a car with an error', async () => {
      try {
        await controller.updateCar(null, multerFileMock);
      } catch (error) {
        expect(error.response).toBe('Fail at update car');
      }
    });
  });

  describe('Delete a car', () => {
    it('Should delete a car', async () => {
      const carSaved = await controller.saveCar(multerFileMock, carMockDto);
      const resultOfCarDeleted = await controller.removeCar(
        String(carSaved.id),
      );
      expect(resultOfCarDeleted.affected).toBe(1);
    });

    it('Should return that not affected a car when trying to delete a car that not exists', async () => {
      const resultOfCarDeleted = await controller.removeCar(String('2'));
      expect(resultOfCarDeleted.affected).toBe(0);
    });

    it('Should return a exception when trying to delete a car with an error', async () => {
      try {
        await controller.removeCar(null);
      } catch (error) {
        expect(error.response).toBe('Fail at delete car');
      }
    });

    it('Should return a exception when trying to delete a car that is rented', async () => {
      const clientMock = {
        firstname: 'Pepe',
        lastname: 'Dos',
        email: 'pepe@gmail.com',
        document_type: 'DNI',
        document_number: 10111000,
        nationality: 'Argentina',
        phone: '1111110077',
        address: 'Calle Falsa 123',
        date_of_birth: '01/01/1003',
      };

      const rentMock = {
        car_id: 1,
        client_id: 1,
        unit_price: carMockDto.unitPrice,
        total_price: carMockDto.totalPrice,
        date_from: '11/11/2021',
        date_to: '11/11/2021',
        payment_method: 'cash',
        paid_rent: false,
      };

      const carSaved = await controller.saveCar(multerFileMock, carMockDto);

      await clientService.register(clientMock);
      await rentService.save(rentMock);

      try {
        await controller.removeCar(String(carSaved.id));
      } catch (error) {
        expect(error.response).toBe('This car is rented');
      }
    });
  });
});
