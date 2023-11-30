import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../client/entities/client.entity';
import { assignDatabaseConfig } from 'src/config';
import { ClientService } from './client.service';

describe('Client service', () => {
  let service: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
        TypeOrmModule.forFeature([Client]),
      ],
      providers: [ClientService],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

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

  it('Should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should register a client in the database', async () => {
    const clientRegistered = await service.register(clientMock);
    expect(clientRegistered.id).toBe(1);
  });

  it('Should get all clients of the database', async () => {
    await service.register(clientMock);
    const clients = await service.getAll();
    expect(clients.length).toBe(1);
  });

  it('Should get a client by id of the database', async () => {
    await service.register(clientMock);
    const client = await service.getById(1);
    expect(client).toBeTruthy();
  });

  it('Should get a client by dni of the database', async () => {
    await service.register(clientMock);
    const client = await service.getByDni(clientMock.document_number);
    expect(client).toBeTruthy();
  });
});
