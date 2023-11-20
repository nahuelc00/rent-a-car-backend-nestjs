import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cars' })
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  license_plate: string;

  @Column()
  year: number;

  @Column()
  color: string;

  @Column()
  passengers: number;

  @Column()
  model: string;

  @Column()
  kilometers: number;

  @Column()
  air_conditioning: boolean;

  @Column()
  transmission: string;

  @Column()
  image_url: string;

  @Column()
  unit_price: number;

  @Column()
  total_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
