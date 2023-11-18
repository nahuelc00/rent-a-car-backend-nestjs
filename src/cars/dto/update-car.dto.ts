import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  id: string;
  brand?: string;
  year?: number;
  color?: string;
  passengers?: number;
  model?: string;
  kilometers?: number;
  airConditioning?: 'yes' | 'no';
  imageUrl?: string;
  transmission?: string;
  unitPrice: number;
  totalPrice: number;
}
