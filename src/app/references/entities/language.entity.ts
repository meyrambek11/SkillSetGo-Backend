import { FreelancerLanguage } from 'src/app/freelancers/entities/freelancer-languages.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum LanguageCodes {
  KAZAKH = 'kz',
  ENGLISH = 'en',
  RUSSIAN = 'ru',
}

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: LanguageCodes;

  @OneToMany(() => FreelancerLanguage, (freelancer) => freelancer.language)
  freelancers: FreelancerLanguage[];
}
