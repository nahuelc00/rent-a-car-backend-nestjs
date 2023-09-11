import { CreateCarDto } from '../dto/create-car.dto';
import { UpdateCarDto } from '../dto/update-car.dto';
import { ICarMappedToDb } from '../interfaces/car-mapped-to-db.interface';

export function mapEntityToDb(
  car: CreateCarDto | UpdateCarDto,
): ICarMappedToDb {
  return {
    brand: car.brand,
    year: car.year,
    color: car.color,
    passengers: car.passengers,
    model: car.model,
    kilometers: car.kilometers,
    air_conditioning: car.airConditioning,
    transmission: car.transmission,
  };
}
