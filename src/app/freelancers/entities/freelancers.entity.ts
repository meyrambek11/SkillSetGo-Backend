import { AvailabilityStatus } from 'src/app/references/entities/availability-status.entity';
import { Specialization } from 'src/app/references/entities/specialization.entity';
import { User } from 'src/app/users/users.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreelancerEducation } from './freelancer-educations.entity';
import { FreelancerLanguage } from './freelancer-languages.entity';
import { FreelancerExperience } from './freelancer-experiences.entity';
import { FreelancerWorkExperience } from './freelancer-work-experiences.entity';
import { Order } from 'src/app/orders/entities/orders.entity';
import { UserBasket } from 'src/app/users-basket/entities/users-basket.entity';

@Entity('freelancers')
export class Freelancer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.freelancer, { nullable: false })
  user: User;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  pricePerHour: number;

  @ManyToOne(
    () => AvailabilityStatus,
    (availabilityStatus) => availabilityStatus.freelancers,
  )
  availabilityStatus: AvailabilityStatus;

  @ManyToMany(() => Specialization)
  @JoinTable({
    name: 'freelancer_specialization_relations',
    joinColumn: {
      name: 'freelancer_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'specialization_id',
      referencedColumnName: 'id',
    },
  })
  specializations: Specialization[];

  @OneToMany(() => FreelancerEducation, (education) => education.freelancer)
  educations: FreelancerEducation[];

  @OneToMany(() => FreelancerLanguage, (language) => language.freelancer)
  languages: FreelancerLanguage[];

  @OneToMany(() => FreelancerExperience, (experience) => experience.freelancer)
  experiences: FreelancerExperience[];

  @OneToMany(
    () => FreelancerWorkExperience,
    (workExperience) => workExperience.freelancer,
  )
  workExperiences: FreelancerWorkExperience[];

  @OneToMany(() => UserBasket, (basket) => basket.freelancer)
  baskets: UserBasket[];

  @OneToMany(() => Order, (order) => order.freelancer)
  orders: Order[];

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'NOW()' })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}
