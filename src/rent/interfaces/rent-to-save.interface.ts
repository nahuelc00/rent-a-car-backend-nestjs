export interface IRentToSave {
  carId: number;
  clientId: number;
  unitPrice: number;
  totalPrice: number;
  dateFrom: string;
  dateTo: string;
  paymentMethod: string;
  paidRent: boolean;
}
