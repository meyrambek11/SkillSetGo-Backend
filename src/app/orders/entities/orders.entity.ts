import { Freelancer } from 'src/app/freelancers/entities/freelancers.entity';
import { Task } from 'src/app/tasks/entities/tasks.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from './order-statuses.entity';
import { User } from 'src/app/users/users.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.orders, {
    nullable: false,
  })
  freelancer: Freelancer;

  @ManyToOne(() => User, (customer) => customer.orders, { nullable: false })
  customer: User;

  @ManyToOne(() => Task, (task) => task.orders, { nullable: false })
  task: Task;

  @ManyToOne(() => OrderStatus, (status) => status.orders, { nullable: false })
  status: OrderStatus;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: true })
  letter: string;

  @Column('text', { array: true, nullable: true })
  files: string[];

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
