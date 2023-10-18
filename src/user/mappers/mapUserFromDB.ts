import { IUserMappedFromDb } from '../interfaces/user-mapped-from-db.interface';

function mapUserFromDB(user): IUserMappedFromDb {
  return {
    email: user.email,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
  };
}

export { mapUserFromDB };
