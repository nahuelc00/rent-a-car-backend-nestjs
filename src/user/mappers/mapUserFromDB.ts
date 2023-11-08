import { User } from '../entities/user.entity';
import { IUserMappedFromDb } from '../interfaces/user-mapped-from-db.interface';

function mapUserFromDB(user: User): IUserMappedFromDb {
  return {
    email: user.email,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    roles: user.roles,
  };
}

export { mapUserFromDB };
