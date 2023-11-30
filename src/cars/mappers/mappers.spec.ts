import { mapEntityToDb } from './mapEntityToDb';
import { mapEntity } from './mapEntityFromDb';
import { ICarToDb } from '../interfaces/car-to-db.interface';
import { Car } from '../entities/car.entity';

describe('Cars mappers', () => {
  describe('Mapping to database', () => {
    it('Should receive a car in camelCase and return a mapped car in snake_case', () => {
      const carToDbMock: ICarToDb = {
        brand: 'Brand',
        year: 1994,
        color: 'Red',
        passengers: 4,
        model: 'Model',
        kilometers: 1234,
        airConditioning: 'yes',
        imageUrl: 'http://1234/image123',
        licensePlate: '123LIC',
        transmission: 'automatic',
        unitPrice: 1000,
        totalPrice: 10000,
      };

      const result = {
        brand: 'Brand',
        year: 1994,
        color: 'Red',
        passengers: 4,
        model: 'Model',
        kilometers: 1234,
        air_conditioning: 'yes' ? true : false,
        image_url: 'http://1234/image123',
        license_plate: '123LIC',
        transmission: 'automatic',
        unit_price: 1000,
        total_price: 10000,
      };

      const carToDbMapped = mapEntityToDb(carToDbMock);
      expect(carToDbMapped).toEqual(result);
    });
  });

  describe('Mapping from the database', () => {
    it('Should receive a car in snake_case and return a mapped car in camelCase', () => {
      const carEntityMock: Car = {
        id: 1,
        brand: 'Brand',
        year: 1994,
        color: 'Red',
        passengers: 4,
        model: 'Model',
        kilometers: 1234,
        air_conditioning: true,
        image_url: 'http://1234/image123',
        license_plate: '123LIC',
        transmission: 'automatic',
        unit_price: 1000,
        total_price: 10000,
        created_at: new Date('2023-11-27 19:22:36'),
        updated_at: new Date('2023-11-27 19:30:00'),
      };

      const result = {
        id: 1,
        brand: 'Brand',
        year: 1994,
        color: 'Red',
        passengers: 4,
        model: 'Model',
        kms: 1234,
        airConditioning: true,
        imageUrl: 'http://1234/image123',
        licensePlate: '123LIC',
        transmission: 'automatic',
        unitPrice: 1000,
        totalPrice: 10000,
        createdAt: new Date('2023-11-27 19:22:36'),
        updatedAt: new Date('2023-11-27 19:30:00'),
      };

      const carMappedFromDb = mapEntity(carEntityMock);

      expect(carMappedFromDb).toEqual(result);
    });
  });
});
