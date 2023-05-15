import { FreelancerLanguage } from 'src/app/freelancers/entities/freelancer-languages.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum LanguageDegreeCodes {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCE = 'advance',
}

@Entity('language_degrees')
export class LanguageDegree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  order: number;

  @OneToMany(
    () => FreelancerLanguage,
    (freelancer) => freelancer.languageDegree,
  )
  freelancers: FreelancerLanguage[];
}
