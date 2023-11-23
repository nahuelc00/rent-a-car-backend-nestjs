export interface IRentFromDb {
  id: number;
  car_id: number;
  client_id: number;
  unit_price: number;
  total_price: number;
  date_from: string;
  date_to: string;
  payment_method: string;
  paid_rent: boolean;
}
