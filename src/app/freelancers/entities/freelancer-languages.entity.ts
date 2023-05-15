import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Freelancer } from './freelancers.entity';
import { Language } from 'src/app/references/entities/language.entity';
import { LanguageDegree } from 'src/app/references/entities/language-degree.entity';

@Entity('freelancer_languages')
export class FreelancerLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.languages, {
    nullable: false,
  })
  freelancer: Freelancer;

  @ManyToOne(() => Language, (language) => language.freelancers, {
    nullable: false,
  })
  language: Language;

  @ManyToOne(
    () => LanguageDegree,
    (languageDegree) => languageDegree.freelancers,
    { nullable: false },
  )
  languageDegree: LanguageDegree;
}
