import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assignDatabaseConfig } from 'src/config';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('User service', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  const userMock = {
    email: 'emailmock@gmail.com',
    firstname: 'Name',
    lastname: 'Mock',
    password: '1234',
    username: 'emailmock',
    roles: 'user',
  };

  it('Should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should save a user in the database', async () => {
    const userSaved = await service.save(userMock);
    const resultExpected = {
      id: 1,
      email: 'emailmock@gmail.com',
      firstname: 'Name',
      lastname: 'Mock',
      password: '1234',
      username: 'emailmock',
      roles: 'user',
      created_at: new Date(userSaved.created_at),
      updated_at: new Date(userSaved.updated_at),
    };

    expect(userSaved).toEqual(resultExpected);
  });

  it('Should get a user by id', async () => {
    const userSaved = await service.save(userMock);
    const resultExpected = {
      id: 1,
      email: 'emailmock@gmail.com',
      firstname: 'Name',
      lastname: 'Mock',
      password: '1234',
      username: 'emailmock',
      roles: 'user',
      created_at: new Date(userSaved.created_at),
      updated_at: new Date(userSaved.updated_at),
    };

    expect(userSaved).toEqual(resultExpected);
  });

  it('Should get a user by email', async () => {
    await service.save(userMock);
    const user = await service.getByEmail('emailmock@gmail.com');

    const resultExpected = {
      id: 1,
      email: 'emailmock@gmail.com',
      password: '1234',
    };

    expect(user).toEqual(resultExpected);
  });
});
