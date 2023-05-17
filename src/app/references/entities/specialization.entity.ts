import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SpecializationCategory } from './specialization-category.entity';

@Entity('specializations')
export class Specialization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  label: string;

  @ManyToOne(
    () => SpecializationCategory,
    (category) => category.specializations,
  )
  category: SpecializationCategory;
}
