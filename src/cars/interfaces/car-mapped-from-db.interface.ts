export interface ICarMappedFromDb {
  id: number;
  brand: string;
  year: number;
  color: string;
  passengers: number;
  model: string;
  kms: number;
  airConditioning: boolean;
  transmission: string;
  imageUrl: string;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
