import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.entity';

export enum RoleCodes {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  FREELANCER = 'freelancer',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  code: RoleCodes;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
