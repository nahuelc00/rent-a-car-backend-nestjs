import { CreateUserDto } from '../dto/create-user.dto';
import { IUserMappedToDb } from '../interfaces/user-mapped-to-db.interface';

function createUsername(userEmail: string) {
  const emailSplitted = userEmail.split('@');
  const username = emailSplitted[0];
  return username;
}

function mapUserToDB(user: CreateUserDto): IUserMappedToDb {
  return {
    email: user.email,
    password: user.password,
    firstname: user.firstname,
    lastname: user.lastname,
    username: createUsername(user.email),
  };
}

export { mapUserToDB };
