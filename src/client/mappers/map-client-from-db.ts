import { IClientMappedFromDb } from '../interfaces/client-mapped-from-db.interface';
import { IClientToDb } from '../interfaces/client-to-db.interface';

function mapClientFromDB(client: IClientToDb): IClientMappedFromDb {
  return {
    id: client.id,
    firstname: client.firstname,
    lastname: client.lastname,
    email: client.email,
    documentType: client.document_type,
    documentNumber: client.document_number,
    nationality: client.nationality,
    phone: client.phone,
    address: client.address,
    dateOfBirth: client.date_of_birth,
  };
}

export { mapClientFromDB };
