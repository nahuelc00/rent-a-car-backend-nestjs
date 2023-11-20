import { ICarMappedToDb } from '../interfaces/car-mapped-to-db.interface';
import { ICarToDb } from '../interfaces/car-to-db.interface';

function validateAirConditioning(airConditioning: 'yes' | 'no') {
  return airConditioning === 'yes';
}

export function mapEntityToDb(car: ICarToDb): ICarMappedToDb {
  return {
    brand: car.brand,
    year: car.year,
    color: car.color,
    passengers: car.passengers,
    model: car.model,
    kilometers: car.kilometers,
    air_conditioning: validateAirConditioning(car.airConditioning),
    license_plate: car.licensePlate,
    image_url: car.imageUrl,
    transmission: car.transmission,
    unit_price: car.unitPrice,
    total_price: car.totalPrice,
  };
}
