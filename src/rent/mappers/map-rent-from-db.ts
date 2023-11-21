import { IRentFromDb } from '../interfaces/rent-from-db.interface';
import { IRentMappedFromDb } from '../interfaces/rent-mapped-from-db.interface';

function mapRentFromDb(rentFromDb: IRentFromDb): IRentMappedFromDb {
  return {
    id: rentFromDb.id,
    car: rentFromDb.car,
    client: rentFromDb.client,
    unitPrice: rentFromDb.unit_price,
    totalPrice: rentFromDb.total_price,
    dateFrom: rentFromDb.date_from,
    dateTo: rentFromDb.date_to,
    paymentMethod: rentFromDb.payment_method,
    paidRent: rentFromDb.paid_rent,
  };
}

export { mapRentFromDb };
