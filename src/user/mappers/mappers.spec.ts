import { mapUserFromDB } from './mapUserFromDB';
import { mapUserToDB } from './mapUserToDB';

describe('User mappers', () => {
  describe('Mapping to database', () => {
    it('Should receive a user in camelCase and return a mapped user in snake_case with username', () => {
      const userToDbMock = {
        email: 'emailmock@gmail.com',
        password: '1234',
        firstname: 'Pepe',
        lastname: 'Lastname',
        roles: 'user',
      };

      const resultExpected = {
        email: 'emailmock@gmail.com',
        password: '1234',
        firstname: 'Pepe',
        lastname: 'Lastname',
        username: 'emailmock',
        roles: 'user',
      };

      const userMappedToDb = mapUserToDB(userToDbMock);
      expect(userMappedToDb).toEqual(resultExpected);
    });
  });

  describe('Mapping from the database', () => {
    it('Should receive a user in snake_case and return a mapped user in camelCase', () => {
      const userEntityMock = {
        id: 1,
        email: 'emailmock@gmail.com',
        firstname: 'Pepe',
        lastname: 'Lastname',
        roles: 'user',
        username: 'emailmock',
        password: '1234',
        created_at: new Date('2023-11-27 19:22:36'),
        updated_at: new Date('2023-11-27 19:32:36'),
      };

      const resultExpected = {
        email: 'emailmock@gmail.com',
        username: 'emailmock',
        firstname: 'Pepe',
        lastname: 'Lastname',
        roles: 'user',
      };

      const userMappedFromDb = mapUserFromDB(userEntityMock);
      expect(userMappedFromDb).toEqual(resultExpected);
    });
  });
});
