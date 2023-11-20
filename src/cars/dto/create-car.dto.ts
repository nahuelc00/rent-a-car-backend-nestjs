export class CreateCarDto {
  brand: string;
  year: number;
  color: string;
  passengers: number;
  model: string;
  kilometers: number;
  licensePlate: string;
  airConditioning: 'yes' | 'no';
  transmission: string;
  unitPrice: number;
  totalPrice: number;
}
