import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

export enum EventTypes {
  message = 'message',
  response = 'response',
  changeStatus = 'changeStatus',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sendingEvents)
  fromUser: User;

  @ManyToOne(() => User, (user) => user.recipientingEvents)
  toUser: User;

  @Column({ nullable: false })
  type: EventTypes;

  @Column({ nullable: true, type: 'jsonb' })
  value: object | object[];

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
