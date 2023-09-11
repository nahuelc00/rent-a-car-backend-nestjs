import { PartialType } from '@nestjs/mapped-types';
import { CreateCarToDbDto } from './create-car-to-db.dto';

export class UpdateCarToDbDto extends PartialType(CreateCarToDbDto) {
  brand?: string;
  year?: number;
  color?: string;
  passengers?: number;
  model?: string;
  kilometers?: number;
  air_conditioning?: boolean;
  transmission?: string;
}
