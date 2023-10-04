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
  createdAt: Date;
  updatedAt: Date;
}
