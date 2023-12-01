import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assignDatabaseConfig } from 'src/config';
import { Client } from './entities/client.entity';
import { ClientService } from './client.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as httpMocks from 'node-mocks-http';
import { UserController } from 'src/user/user.controller';

describe('Client controller', () => {
  let controller: ClientController;
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
        TypeOrmModule.forFeature([Client, User]),
      ],
      providers: [ClientService, UserService],
      controllers: [ClientController, UserController],
    }).compile();

    controller = module.get<ClientController>(ClientController);
    userController = module.get<UserController>(UserController);
  });

  const createClientDtoMock = {
    firstname: 'Pepe',
    lastname: 'Pepeapellido',
    email: 'pepeapellido@gmail.com',
    documentType: 'DNI',
    documentNumber: 11333222,
    nationality: 'Argentina',
    phone: '1111112222',
    address: 'Calle falsa 123',
    dateOfBirth: '1992-02-21',
  };

  it('Should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Register client', () => {
    it('Should register a client', async () => {
      const clientRegistered =
        await controller.registerClient(createClientDtoMock);
      expect(clientRegistered.registered).toBe('pepeapellido@gmail.com');
    });

    it('Should give an error when trying to register a client with an existing email address', async () => {
      await controller.registerClient(createClientDtoMock);

      try {
        await controller.registerClient(createClientDtoMock);
      } catch (error) {
        expect(error.response).toBe('This email already exists');
      }
    });

    it('Should give an error when trying to register a client with an existing document number', async () => {
      await controller.registerClient(createClientDtoMock);

      try {
        await controller.registerClient({
          ...createClientDtoMock,
          email: 'otheremail@gmail.com',
        });
      } catch (error) {
        expect(error.response).toBe('This document number already exists');
      }
    });
  });

  describe('Get client', () => {
    it('Should get a client if is user admin', async () => {
      process.env.PRIVATE_KEY_JWT = 'asdf';

      await controller.registerClient(createClientDtoMock);

      await userController.register({
        email: 'pepeemail@gmail.com',
        password: 'pepepassword1234',
        lastname: 'Pepe',
        firstname: 'Apellido',
        roles: 'user,admin',
      });
      const userToken = await userController.login({
        email: 'pepeemail@gmail.com',
        password: 'pepepassword1234',
      });

      const request: any = httpMocks.createRequest({
        headers: {
          authorization: userToken.token,
        },
      });
      const response = httpMocks.createResponse();

      await controller.getClient('1', response, request);

      const responseData = response._getData();

      const result = {
        id: 1,
        firstname: 'Pepe',
        lastname: 'Pepeapellido',
        email: 'pepeapellido@gmail.com',
        documentType: 'DNI',
        documentNumber: 11333222,
        nationality: 'Argentina',
        phone: '1111112222',
        address: 'Calle falsa 123',
        dateOfBirth: '1992-02-21',
      };

      expect(responseData).toEqual(result);
    });

    it('Should give error when trying get a client and not is user admin', async () => {
      process.env.PRIVATE_KEY_JWT = 'asdf';

      await controller.registerClient(createClientDtoMock);

      await userController.register({
        email: 'pepeemail@gmail.com',
        password: 'pepepassword1234',
        lastname: 'Pepe',
        firstname: 'Apellido',
        roles: 'user',
      });
      const userToken = await userController.login({
        email: 'pepeemail@gmail.com',
        password: 'pepepassword1234',
      });

      const request: any = httpMocks.createRequest({
        headers: {
          authorization: userToken.token,
        },
      });
      const response = httpMocks.createResponse();

      await controller.getClient('1', response, request);

      const responseData = response._getData();

      const result = {
        statusCode: 401,
        message: 'Only for admin user',
      };

      expect(responseData).toEqual(result);
    });

    it('Should give error when trying get a client and not is user logged', async () => {
      const request: any = httpMocks.createRequest({
        headers: {
          authorization: '',
        },
      });
      const response = httpMocks.createResponse();

      try {
        await controller.getClient('1', response, request);
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.response).toBe('Unauthorized');
      }
    });
  });
});
