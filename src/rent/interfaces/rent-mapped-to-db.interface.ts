export interface IRentMappedToDb {
  car: number;
  client: number;
  unit_price: number;
  total_price: number;
  date_from: string;
  date_to: string;
  payment_method: string;
  paid_rent: boolean;
}
