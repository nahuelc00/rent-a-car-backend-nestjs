import { mapRentFromDb } from './map-rent-from-db';
import { mapRentToDb } from './map-rent-to-db';

describe('Rent mappers', () => {
  describe('Mapping to database', () => {
    it('Should receive a rent in camelCase and return a mapped rent in snake_case', () => {
      const rentToDbMock = {
        carId: 1,
        clientId: 1,
        unitPrice: 123444,
        totalPrice: 43000,
        dateFrom: '2222-03-01',
        dateTo: '2222-04-01',
        paymentMethod: 'cash',
        paidRent: true,
      };

      const resultExpected = {
        car_id: 1,
        client_id: 1,
        unit_price: 123444,
        total_price: 43000,
        date_from: '2222-03-01',
        date_to: '2222-04-01',
        payment_method: 'cash',
        paid_rent: true,
      };

      const rentMappedToDb = mapRentToDb(rentToDbMock);

      expect(rentMappedToDb).toEqual(resultExpected);
    });
  });

  describe('Mapping from the database', () => {
    it('Should receive a rent in snake_case and return a mapped rent in camelCase', () => {
      const rentFromDbMock = {
        id: 1,
        car_id: 1,
        client_id: 1,
        unit_price: 43300,
        total_price: 433200,
        date_from: '2222-03-01',
        date_to: '2222-04-01',
        payment_method: 'card',
        paid_rent: true,
      };

      const resultExpected = {
        id: 1,
        car: 1,
        client: 1,
        unitPrice: 43300,
        totalPrice: 433200,
        dateFrom: '2222-03-01',
        dateTo: '2222-04-01',
        paymentMethod: 'card',
        paidRent: true,
      };

      const rentMappedFromDb = mapRentFromDb(rentFromDbMock);
      expect(rentMappedFromDb).toEqual(resultExpected);
    });
  });
});
