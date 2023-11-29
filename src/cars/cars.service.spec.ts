import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { User } from '../user/entities/user.entity';
import { Client } from '../client/entities/client.entity';
import { Rent } from '../rent/entities/rent.entity';
import { assignDatabaseConfig } from 'src/config';

describe('Cars service', () => {
  let service: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(assignDatabaseConfig(process.env.NODE_ENV)),
        TypeOrmModule.forFeature([Car, User, Client, Rent]),
      ],
      providers: [CarsService],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  const carMock = {
    brand: 'Ford',
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

  it('Should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should save a car in the database', async () => {
    const carSaved = await service.save(carMock);
    expect(carSaved.id).toBe(1);
  });

  it('Should get all cars of the database', async () => {
    await service.save(carMock);
    const cars = await service.getAll();
    expect(cars.length).toBe(1);
  });

  it('Should get a car by id of the database', async () => {
    await service.save(carMock);
    const car = await service.getById(1);
    expect(car).toBeTruthy();
  });

  it('Should get a car by license plate of the database', async () => {
    await service.save(carMock);
    const car = await service.getByLicensePlate(carMock.license_plate);
    expect(car).toBeTruthy();
  });

  it('Should update a car of the database', async () => {
    await service.save(carMock);

    const carToUpdate = {
      brand: 'Fiat',
      year: 2022,
      license_plate: 'SSS222',
      color: 'Blue',
      passengers: 3,
      model: 'Modelo2',
      image_url: 'http://imagemock12345/asdsdsa',
      kilometers: 10,
      air_conditioning: false,
      transmission: 'automatic',
      unit_price: 10,
      total_price: 30000,
    };

    const resultOfCarUpdated = await service.update(1, carToUpdate);

    expect(resultOfCarUpdated.affected).toBe(1);
  });

  it('Should delete a car of the database', async () => {
    const carSaved = await service.save(carMock);

    const resultOfCarDeleted = await service.remove(carSaved.id);

    const cars = await service.getAll();

    expect(resultOfCarDeleted.affected).toBe(1);
    expect(cars.length).toBe(0);
  });
});
