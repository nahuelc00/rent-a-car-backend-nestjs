import { Car } from 'src/cars/entities/car.entity';
import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'rents' })
export class Rent {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Client, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToOne(() => Car, (car) => car.id)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @Column()
  total_price: number;

  @Column()
  unit_price: number;

  @Column()
  date_from: string;

  @Column()
  date_to: string;

  @Column()
  payment_method: string;

  @Column()
  paid_rent: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
