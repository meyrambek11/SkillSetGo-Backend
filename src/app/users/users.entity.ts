import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../roles/roles.entity';
import { Country } from '../references/entities/country.entity';
import { City } from '../references/entities/city.entity';
import { Currency } from '../references/entities/currency.entity';
import { Freelancer } from '../freelancers/entities/freelancers.entity';
import { Task } from '../tasks/entities/tasks.entity';
import { UserBasket } from '../users-basket/entities/users-basket.entity';
import { Event } from '../chats/chats.entity';
import { Order } from '../orders/entities/orders.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  surname: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: false, select: false })
  email: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true, select: false })
  phoneNumber: string;

  @Column({ nullable: false, default: 0, select: false })
  balance: number;

  @ManyToOne(() => Currency, (currency) => currency.users)
  currency: Currency;

  @Column({ nullable: false, default: false, select: false })
  isBan: boolean;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  role: Role;

  @ManyToOne(() => Country, (country) => country.users)
  country: Country;

  @ManyToOne(() => City, (city) => city.users)
  city: City;

  @OneToMany(() => UserBasket, (basket) => basket.user)
  baskets: UserBasket[];

  @OneToOne(() => Freelancer, (freelancer) => freelancer.user)
  @JoinColumn()
  freelancer: Freelancer;

  @OneToMany(() => Event, (event) => event.fromUser)
  sendingEvents: Event[];

  @OneToMany(() => Event, (event) => event.toUser)
  recipientingEvents: Event[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
