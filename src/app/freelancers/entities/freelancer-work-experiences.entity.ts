import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Freelancer } from './freelancers.entity';

@Entity('freelancer_work_experiences')
export class FreelancerWorkExperience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.workExperiences, {
    nullable: false,
  })
  freelancer: Freelancer;

  @Column({ nullable: false })
  companyName: string;

  @Column({ nullable: false })
  position: string;

  @Column({ nullable: false })
  yearBegin: number;

  @Column({ nullable: true })
  yearEnd: number;

  @Column({ nullable: true, type: 'text' })
  accomplishment: string;
}
