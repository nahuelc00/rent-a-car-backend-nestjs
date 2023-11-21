export interface IRentMappedFromDb {
  id: number;
  car: number;
  client: number;
  unitPrice: number;
  totalPrice: number;
  dateFrom: string;
  dateTo: string;
  paymentMethod: string;
  paidRent: boolean;
}
