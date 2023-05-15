import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';
import { User } from 'src/app/users/users.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];

  @OneToMany(() => User, (user) => user.country)
  users: User[];
}
