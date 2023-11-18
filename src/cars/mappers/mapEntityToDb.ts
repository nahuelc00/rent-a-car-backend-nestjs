import { CreateCarDto } from '../dto/create-car.dto';
import { UpdateCarDto } from '../dto/update-car.dto';
import { ICarMappedToDb } from '../interfaces/car-mapped-to-db.interface';

function validateAirConditioning(airConditioning: 'yes' | 'no') {
  return airConditioning === 'yes';
}

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
    air_conditioning: validateAirConditioning(car.airConditioning),
    image_url: car.imageUrl,
    transmission: car.transmission,
    unit_price: car.unitPrice,
    total_price: car.totalPrice,
  };
}
