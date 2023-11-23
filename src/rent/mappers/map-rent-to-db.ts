import { IRentMappedToDb } from '../interfaces/rent-mapped-to-db.interface';
import { IRentToSave } from '../interfaces/rent-to-save.interface';

function mapRentToDb(rentToSave: IRentToSave): IRentMappedToDb {
  return {
    car_id: rentToSave.carId,
    client_id: rentToSave.clientId,
    total_price: rentToSave.totalPrice,
    unit_price: rentToSave.unitPrice,
    date_from: rentToSave.dateFrom,
    date_to: rentToSave.dateTo,
    payment_method: rentToSave.paymentMethod,
    paid_rent: rentToSave.paidRent,
  };
}

export { mapRentToDb };
