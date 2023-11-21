export class CreateRentDto {
  carLicensePlate: string;
  dniClient: number;
  unitPrice: number;
  totalPrice: number;
  dateFrom: string;
  dateTo: string;
  paymentMethod: string;
  paidRent: boolean;
}
