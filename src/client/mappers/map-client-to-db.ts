import { CreateClientDto } from '../dto/create-client.dto';
import { IClientMappedToDb } from '../interfaces/client-mapped-to-db.interface';

function mapClientToDB(client: CreateClientDto): IClientMappedToDb {
  return {
    firstname: client.firstname,
    lastname: client.lastname,
    email: client.email,
    document_type: client.documentType,
    document_number: client.documentNumber,
    nationality: client.nationality,
    phone: client.phone,
    address: client.address,
    date_of_birth: client.dateOfBirth,
  };
}

export { mapClientToDB };
