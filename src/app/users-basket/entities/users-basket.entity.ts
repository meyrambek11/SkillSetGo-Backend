import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Freelancer } from 'src/app/freelancers/entities/freelancers.entity';
import { Task } from 'src/app/tasks/entities/tasks.entity';
import { UserBasketStatus } from './user-basket-statuses.entity';
import { User } from 'src/app/users/users.entity';

@Entity('users_basket')
export class UserBasket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.baskets, { nullable: false })
  user: User;

  @ManyToOne(() => UserBasketStatus, (status) => status.baskets, {
    nullable: false,
  })
  status: UserBasketStatus;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.baskets, {
    nullable: true,
  })
  freelancer: Freelancer;

  @ManyToOne(() => Task, (task) => task.baskets, { nullable: true })
  task: Task;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
