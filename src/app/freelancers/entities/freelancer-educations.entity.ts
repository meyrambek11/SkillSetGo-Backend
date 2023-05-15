import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Freelancer } from './freelancers.entity';

@Entity('freelancer_educations')
export class FreelancerEducation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.educations, {
    nullable: false,
  })
  freelancer: Freelancer;

  @Column({ nullable: false })
  educationalInstitution: string;

  @Column({ nullable: false })
  specialization: string;

  @Column({ nullable: false })
  yearBegin: number;

  @Column({ nullable: true })
  yearEnd: number;
}
