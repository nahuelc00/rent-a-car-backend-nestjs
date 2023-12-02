import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assignDatabaseConfig } from 'src/config';
import { RentService } from './rent.service';
import { Rent } from './entities/rent.entity';
import { Client } from 'src/client/entities/client.entity';
import { Car } from 'src/cars/entities/car.entity';
import { ClientService } from 'src/client/client.service';
import { CarsService } from 'src/cars/cars.service';

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
const rentToDbMock = {
  car_id: 1,
  client_id: 1,
  unit_price: 20,
  total_price: 20000,
  date_from: '2222-03-01',
  date_to: '2222-04-01',
  payment_method: 'cash',
  paid_rent: true,
};

describe('Rent service', () => {
  let service: RentService;
  let clientService: ClientService;
  let carsService: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
        TypeOrmModule.forFeature([Rent, Client, Car]),
      ],
      providers: [RentService, ClientService, CarsService],
    }).compile();

    service = module.get<RentService>(RentService);
    carsService = module.get<CarsService>(CarsService);
    clientService = module.get<ClientService>(ClientService);
  });

  it('Should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should save a rent in the database', async () => {
    await clientService.register(clientMock);
    await carsService.save(carMock);
    const rentSaved = await service.save(rentToDbMock);
    const resultExpected = {
      car_id: 1,
      client_id: 1,
      unit_price: 20,
      total_price: 20000,
      date_from: '2222-03-01',
      date_to: '2222-04-01',
      payment_method: 'cash',
      paid_rent: true,
      id: 1,
      created_at: new Date(rentSaved.created_at),
      updated_at: new Date(rentSaved.updated_at),
    };

    expect(rentSaved).toEqual(resultExpected);
  });

  it('Should update a rent in the database', async () => {
    await clientService.register(clientMock);
    await carsService.save(carMock);
    await service.save(rentToDbMock);

    const resultOfRentUpdated = await service.update(1, {
      ...rentToDbMock,
      total_price: 25000,
    });

    expect(resultOfRentUpdated.affected).toBe(1);
  });

  it('Should remove a rent of the database', async () => {
    await clientService.register(clientMock);
    await carsService.save(carMock);
    await service.save(rentToDbMock);

    const resultOfRentDeleted = await service.remove(1);

    expect(resultOfRentDeleted.affected).toBe(1);
  });

  it('Should get all rents of the database', async () => {
    await clientService.register(clientMock);
    await carsService.save(carMock);
    await service.save(rentToDbMock);
    const rents = await service.getAll();
    expect(rents.length).toBe(1);
  });
});
