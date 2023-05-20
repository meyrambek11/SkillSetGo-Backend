import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './orders.entity';

export enum OrderStatusCodes {
  NEW = 'new',
  ACTIVE = 'active',
  COMPLITED = 'complited',
  REJECT = 'reject',
  REVIEW = 'review',
}

@Entity('order_status')
export class OrderStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: OrderStatusCodes;

  @OneToMany(() => Order, (order) => order.status)
  orders: Order[];
}
