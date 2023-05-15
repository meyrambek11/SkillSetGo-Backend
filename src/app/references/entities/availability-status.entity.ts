import { Freelancer } from 'src/app/freelancers/entities/freelancers.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum AvailabilityStatusCodes {
  BUSY = 'busy',
  FREE = 'free',
}

@Entity('availability_statuses')
export class AvailabilityStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  code: AvailabilityStatusCodes;

  @OneToMany(() => Freelancer, (freelancer) => freelancer.availabilityStatus)
  freelancers: Freelancer[];
}
