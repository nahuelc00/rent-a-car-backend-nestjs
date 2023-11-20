export interface ICarToDb {
  brand: string;
  year: number;
  color: string;
  passengers: number;
  model: string;
  kilometers: number;
  airConditioning: 'yes' | 'no';
  imageUrl: string;
  licensePlate: string;
  transmission: string;
  unitPrice: number;
  totalPrice: number;
}
