import { Module } from '@nestjs/common';
import { FreelancerController } from './freelancers.controller';
import { FreelancerService } from './services/freelancers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from './entities/freelancers.entity';
import { ReferencesModule } from '../references/references.module';
import { FreelancerEducation } from './entities/freelancer-educations.entity';
import { FreelancerEducationService } from './services/freelancers-education.service';
import { FreelancerExperience } from './entities/freelancer-experiences.entity';
import { FreelancerExperienceService } from './services/freelancers-experience.service';
import { FreelancerLanguage } from './entities/freelancer-languages.entity';
import { FreelancerLanguageService } from './services/freelancers-language.service';
import { FreelancerWorkExperience } from './entities/freelancer-work-experiences.entity';
import { FreelancerWorkExperienceService } from './services/freelancers-work-experience.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Freelancer,
      FreelancerEducation,
      FreelancerExperience,
      FreelancerLanguage,
      FreelancerWorkExperience,
    ]),
    ReferencesModule,
  ],
  controllers: [FreelancerController],
  providers: [
    FreelancerService,
    FreelancerEducationService,
    FreelancerExperienceService,
    FreelancerLanguageService,
    FreelancerWorkExperienceService,
  ],
  exports: [FreelancerService],
})
export class FreelancersModule {}
