import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './tasks.entity';

export enum TaskStatusCodes {
  APPOINTED = 'appointed',
  OVERDUE = 'overdue',
  NEW = 'new',
}

@Entity('task_statuses')
export class TaskStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: TaskStatusCodes;

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[];
}
