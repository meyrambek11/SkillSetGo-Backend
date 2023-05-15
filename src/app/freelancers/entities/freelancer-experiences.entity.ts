import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Freelancer } from './freelancers.entity';

@Entity('freelancer_experiences')
export class FreelancerExperience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.experiences, {
    nullable: false,
  })
  freelancer: Freelancer;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;
}
