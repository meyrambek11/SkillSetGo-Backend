import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Specialization } from './specialization.entity';

@Entity('specialization_categories')
export class SpecializationCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  desciption: string;

  @OneToMany(() => Specialization, (specialization) => specialization.category)
  specializations: Specialization[];
}
