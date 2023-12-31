export interface IClientToDb {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  document_type: string;
  document_number: number;
  nationality: string;
  phone: string;
  address: string;
  date_of_birth: string;
  created_at: Date;
  updated_at: Date;
}
