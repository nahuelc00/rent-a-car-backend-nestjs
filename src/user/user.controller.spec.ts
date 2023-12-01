import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assignDatabaseConfig } from 'src/config';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as httpMocks from 'node-mocks-http';

describe('User controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  process.env.PRIVATE_KEY_JWT = 'asd';

  const userDtoMock = {
    email: 'emailpepe@gmail.com',
    password: '1234',
    firstname: 'Pepe',
    lastname: 'Lastname',
    roles: 'user',
  };

  it('Should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Register user', () => {
    it('Should register a user', async () => {
      const userRegistered = await controller.register(userDtoMock);
      expect(userRegistered.registered).toBe('emailpepe@gmail.com');
    });

    it('Should give an error when trying to register a user with an existing email', async () => {
      await controller.register(userDtoMock);

      try {
        await controller.register(userDtoMock);
      } catch (error) {
        expect(error.status).toBe(409);
        expect(error.response).toBe('This email already exists');
      }
    });
  });

  describe('Login user', () => {
    it('Should login a user', async () => {
      await controller.register(userDtoMock);

      const resultOfUserLogged = await controller.login({
        email: userDtoMock.email,
        password: userDtoMock.password,
      });

      expect(resultOfUserLogged.token).toBeTruthy();
    });

    it('Should give error when trying login with invalid credentials', async () => {
      await controller.register(userDtoMock);

      try {
        await controller.login({
          email: 'asdkjsadias@gmail.com',
          password: userDtoMock.password,
        });
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.response).toBe('Invalid credentials');
      }

      try {
        await controller.login({
          email: userDtoMock.email,
          password: 'as',
        });
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.response).toBe('Invalid credentials');
      }
    });
  });

  describe('Get user', () => {
    it('Should get a user', async () => {
      await controller.register(userDtoMock);

      const resultOfLogin = await controller.login({
        email: userDtoMock.email,
        password: userDtoMock.password,
      });

      const request: any = httpMocks.createRequest({
        headers: {
          authorization: resultOfLogin.token,
        },
      });

      const user = await controller.getUser(request);

      const resultExpected = {
        email: 'emailpepe@gmail.com',
        username: 'emailpepe',
        firstname: 'Pepe',
        lastname: 'Lastname',
        roles: 'user',
      };

      expect(user).toEqual(resultExpected);
    });

    it('Should give error when trying to get a user without being logged', async () => {
      await controller.register(userDtoMock);

      try {
        const request: any = httpMocks.createRequest({
          headers: {
            authorization: '',
          },
        });

        await controller.getUser(request);
      } catch (error) {
        expect(error.status).toBe(401);
        expect(error.response).toBe('Unauthorized');
      }
    });
  });
});
