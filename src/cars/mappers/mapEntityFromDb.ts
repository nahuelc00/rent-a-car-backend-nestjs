import { Car } from '../entities/car.entity';
import { ICarMappedFromDb } from '../interfaces/car-mapped-from-db.interface';

export function mapEntity(carEntity: Car): ICarMappedFromDb {
  return {
    id: carEntity.id,
    brand: carEntity.brand,
    year: carEntity.year,
    color: carEntity.color,
    passengers: carEntity.passengers,
    model: carEntity.model,
    kms: carEntity.kilometers,
    airConditioning: carEntity.air_conditioning,
    transmission: carEntity.transmission,
    imageUrl: carEntity.image_url,
    unitPrice: carEntity.unit_price,
    totalPrice: carEntity.total_price,
    licensePlate: carEntity.license_plate,
    createdAt: carEntity.created_at,
    updatedAt: carEntity.updated_at,
  };
}
