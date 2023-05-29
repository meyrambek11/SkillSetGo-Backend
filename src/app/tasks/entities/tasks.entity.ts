import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Currency } from '../../references/entities/currency.entity';
import { User } from '../../users/users.entity';
import { Specialization } from '../../references/entities/specialization.entity';
import { TaskStatus } from './task-statuses.entity';
import { Order } from 'src/app/orders/entities/orders.entity';
import { UserBasket } from 'src/app/users-basket/entities/users-basket.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.tasks)
  status: TaskStatus;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  deadline: string;

  @Column({ nullable: false })
  price: number;

  @ManyToOne(() => Currency, (currency) => currency.tasks)
  currency: Currency;

  @Column('text', { array: true, nullable: true })
  files: string[];

  @ManyToMany(() => Specialization)
  @JoinTable({
    name: 'task_specialization_relations',
    joinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'specialization_id',
      referencedColumnName: 'id',
    },
  })
  specializations: Specialization[];

  @OneToMany(() => UserBasket, (basket) => basket.task)
  baskets: UserBasket[];

  @OneToMany(() => Order, (order) => order.task)
  orders: Order[];

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
