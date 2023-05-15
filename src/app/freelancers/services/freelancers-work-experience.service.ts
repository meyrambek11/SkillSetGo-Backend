import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FreelancerService } from './freelancers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FreelancerWorkExperience } from '../entities/freelancer-work-experiences.entity';
import { DeleteResult, Repository } from 'typeorm';
import { StoreFreelancerWorkExperienceDto } from '../freelancers.dto';
import { UserMetadata } from 'src/common/types/userMetadata';

@Injectable()
export class FreelancerWorkExperienceService {
  constructor(
    private freelancerService: FreelancerService,
    @InjectRepository(FreelancerWorkExperience)
    private freelancerWorkExperienceRepository: Repository<FreelancerWorkExperience>,
  ) {}

  async store(
    payload: StoreFreelancerWorkExperienceDto,
    user: UserMetadata,
  ): Promise<FreelancerWorkExperience> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );
    return await this.freelancerWorkExperienceRepository.save({
      freelancer,
      ...payload,
    });
  }

  async delete(id: string, user: UserMetadata): Promise<DeleteResult> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );
    const workExperience =
      await this.freelancerWorkExperienceRepository.findOne({
        where: { id, freelancer: { id: freelancer.id } },
      });

    if (!workExperience)
      throw new HttpException(
        `Work experience with id: ${id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    return await this.freelancerWorkExperienceRepository.delete(id);
  }
}
