import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assignDatabaseConfig } from 'src/config';
import * as httpMocks from 'node-mocks-http';
import { Rent } from './entities/rent.entity';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { Client } from 'src/client/entities/client.entity';
import { Car } from 'src/cars/entities/car.entity';
import { ClientService } from 'src/client/client.service';
import { CarsService } from 'src/cars/cars.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';

describe('Rent controller', () => {
  let controller: RentController;
  let clientService: ClientService;
  let carsService: CarsService;
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
        TypeOrmModule.forFeature([Rent, Client, Car, User]),
      ],
      providers: [RentService, ClientService, CarsService, UserService],
      controllers: [RentController, UserController],
    }).compile();

    controller = module.get<RentController>(RentController);
    carsService = module.get<CarsService>(CarsService);
    clientService = module.get<ClientService>(ClientService);
    userController = module.get<UserController>(UserController);
  });

  process.env.PRIVATE_KEY_JWT = 'asdf';

  const clientMock = {
    firstname: 'Pepe',
    lastname: 'Pepeapellido',
    email: 'pepeapellido@gmail.com',
    document_type: 'DNI',
    document_number: 11333222,
    nationality: 'Argentina',
    phone: '1111112222',
    address: 'Calle falsa 123',
    date_of_birth: '1992-02-21',
  };
  const carMock = {
    brand: 'Brand',
    year: 2015,
    license_plate: 'SSS111',
    color: 'Red',
    passengers: 4,
    model: 'Modelo',
    image_url: 'http://imagemock1234/asdsdsa',
    kilometers: 45444,
    air_conditioning: true,
    transmission: 'manual',
    unit_price: 20,
    total_price: 20000,
  };
  const rentDtoMock = {
    carLicensePlate: carMock.license_plate,
    dniClient: clientMock.document_number,
    unitPrice: carMock.unit_price,
    totalPrice: carMock.total_price,
    dateFrom: '2023-03-01',
    dateTo: '2024-03-01',
    paymentMethod: 'card',
    paidRent: true,
  };
  const userDtoMock = {
    email: 'pepe@gmail.com',
    password: '1234',
    firstname: 'Pepe',
    lastname: 'Lastname',
    roles: 'user,admin',
  };

  it('Should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Save rent', () => {
    it('Should save a rent', async () => {
      await clientService.register(clientMock);
      await carsService.save(carMock);

      const rentSaved = await controller.saveRent(rentDtoMock);

      const resultExpected = {
        id: 1,
        car: 1,
        client: 1,
        unitPrice: 20,
        totalPrice: 20000,
        dateFrom: '2023-03-01',
        dateTo: '2024-03-01',
        paymentMethod: 'card',
        paidRent: true,
      };

      expect(rentSaved).toEqual(resultExpected);
    });

    it('Should give an error when saving a rent when this rent was registered', async () => {
      try {
        await clientService.register(clientMock);
        await carsService.save(carMock);
        await controller.saveRent(rentDtoMock);

        await controller.saveRent(rentDtoMock);
      } catch (error) {
        expect(error.status).toBe(409);
        expect(error.response).toBe(
          'Check the rentals. It is likely that there is already a rental registered with these credentials.',
        );
      }
    });
  });

  describe('Update rent', () => {
    it('Should update a rent', async () => {
      await clientService.register(clientMock);
      await carsService.save(carMock);
      await controller.saveRent(rentDtoMock);

      const response: any = httpMocks.createResponse();

      await controller.updateRent(response, {
        ...rentDtoMock,
        id: 1,
      });

      const resultOfUpdate = response._getData();
      expect(resultOfUpdate.affected).toBe(1);
    });

    it('Should give an error when trying update a rent that is not found', async () => {
      await clientService.register(clientMock);
      await carsService.save(carMock);

      const response: any = httpMocks.createResponse();

      await controller.updateRent(response, {
        ...rentDtoMock,
        id: 10,
      });

      const resultOfUpdate = response._getData();

      expect(resultOfUpdate.message).toBe('Rent not found');
      expect(resultOfUpdate.statusCode).toBe(404);
    });

    it('Should give an error when trying update a rent with invalid credentials', async () => {
      await clientService.register(clientMock);
      await carsService.save(carMock);
      await controller.saveRent(rentDtoMock);

      const response: any = httpMocks.createResponse();

      try {
        await controller.updateRent(response, {
          ...rentDtoMock,
          id: 1,
          carLicensePlate: '11123',
        });
      } catch (error) {
        expect(error.status).toBe(409);
        expect(error.response).toBe('Fail to update. Check the credentials.');
      }
    });
  });

  describe('Remove rent', () => {
    it('Should remove a rent', async () => {
      await clientService.register(clientMock);
      await carsService.save(carMock);
      await controller.saveRent(rentDtoMock);

      const response: any = httpMocks.createResponse();
      await controller.removeRent(response, '1');

      const resultOfDelete = response._getData();
      expect(resultOfDelete.affected).toBe(1);
    });

    it('Should give an error when trying remove a rent that is not found', async () => {
      const response: any = httpMocks.createResponse();
      await controller.removeRent(response, '1');

      const resultOfDelete = response._getData();

      expect(resultOfDelete.message).toBe('Rent not found');
      expect(resultOfDelete.statusCode).toBe(404);
    });

    it('Should give an error when trying remove a rent with null data', async () => {
      try {
        await controller.removeRent(null, null);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.response).toBe('Fail at delete rent');
      }
    });
  });

  describe('Get rents', () => {
    it('Should get rents if is user admin', async () => {
      await userController.register(userDtoMock);

      const accessToken = await userController.login({
        email: userDtoMock.email,
        password: userDtoMock.password,
      });

      const request: any = httpMocks.createRequest({
        headers: {
          authorization: accessToken.token,
        },
      });

      const response = httpMocks.createResponse();

      await controller.getRents(response, request);

      const resultOfGetRents = response._getData();

      expect(resultOfGetRents).toEqual([]);
    });

    it('Should give an error when get rents if not is user admin', async () => {
      await userController.register({ ...userDtoMock, roles: 'user' });

      const accessToken = await userController.login({
        email: userDtoMock.email,
        password: userDtoMock.password,
      });

      const request: any = httpMocks.createRequest({
        headers: {
          authorization: accessToken.token,
        },
      });

      const response = httpMocks.createResponse();

      await controller.getRents(response, request);

      const resultOfGetRents = response._getData();

      expect(resultOfGetRents).toEqual({
        message: 'Only for admin user',
        statusCode: 401,
      });
    });

    it('Should give an error when get rents if not is user logged', async () => {
      const request: any = httpMocks.createRequest({
        headers: {
          authorization: '',
        },
      });

      const response = httpMocks.createResponse();

      try {
        await controller.getRents(response, request);
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.response).toBe('Unauthorized');
      }
    });
  });
});
