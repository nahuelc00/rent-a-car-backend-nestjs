import { mapClientFromDB } from './map-client-from-db';
import { mapClientToDB } from './map-client-to-db';

describe('Client mappers', () => {
  describe('Mapping to database', () => {
    it('Should receive a client in camelCase and return a mapped client in snake_case', () => {
      const clientToDbMock = {
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

      const resultExpected = {
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

      const clientMappedToDb = mapClientToDB(clientToDbMock);
      expect(clientMappedToDb).toEqual(resultExpected);
    });
  });

  describe('Mapping from the database', () => {
    it('Should receive a client in snake_case and return a mapped client in camelCase', () => {
      const clientFromDb = {
        id: 1,
        firstname: 'Pepe',
        lastname: 'Pepeapellido',
        email: 'pepeapellido@gmail.com',
        document_type: 'DNI',
        document_number: 11333222,
        nationality: 'Argentina',
        phone: '1111112222',
        address: 'Calle falsa 123',
        date_of_birth: '1992-02-21',
        created_at: new Date('2023-11-27 19:22:36'),
        updated_at: new Date('2023-11-27 19:22:36'),
      };

      const resultExpected = {
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

      const clientMappedFromDb = mapClientFromDB(clientFromDb);
      expect(clientMappedFromDb).toEqual(resultExpected);
    });
  });
});
