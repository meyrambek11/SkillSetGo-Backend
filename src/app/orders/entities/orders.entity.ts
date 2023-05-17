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

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.orders)
  freelancer: Freelancer;

  @ManyToOne(() => Task, (task) => task.orders)
  task: Task;

  @ManyToOne(() => OrderStatus, (status) => status.orders)
  status: OrderStatus;

  @Column({nullable: false})
  price: number;

  @Column({nullable: true})
  letter: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
