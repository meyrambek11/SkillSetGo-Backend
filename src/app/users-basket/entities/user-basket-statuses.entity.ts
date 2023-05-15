import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBasket } from './users-basket.entity';

export enum UserBasketStatusCodes {
  FREELANCER = 'freelancer',
  TASK = 'task',
}

@Entity('user_basket_statuses')
export class UserBasketStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: UserBasketStatusCodes;

  @OneToMany(() => UserBasket, (basket) => basket.status)
  baskets: UserBasket[];
}
