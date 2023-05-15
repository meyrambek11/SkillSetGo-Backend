import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FreelancerService } from './freelancers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FreelancerExperience } from '../entities/freelancer-experiences.entity';
import { DeleteResult, Repository } from 'typeorm';
import { StoreFreelancerExperienceDto } from '../freelancers.dto';
import { UserMetadata } from 'src/common/types/userMetadata';

@Injectable()
export class FreelancerExperienceService {
  constructor(
    private freelancerService: FreelancerService,
    @InjectRepository(FreelancerExperience)
    private freelancerExperienceRepository: Repository<FreelancerExperience>,
  ) {}

  async store(
    payload: StoreFreelancerExperienceDto,
    user: UserMetadata,
  ): Promise<FreelancerExperience> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );
    return await this.freelancerExperienceRepository.save({
      freelancer,
      ...payload,
    });
  }

  async delete(id: string, user: UserMetadata): Promise<DeleteResult> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );
    const experience = await this.freelancerExperienceRepository.findOne({
      where: { id, freelancer: { id: freelancer.id } },
    });

    if (!experience)
      throw new HttpException(
        `Experience with id: ${id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    return await this.freelancerExperienceRepository.delete(id);
  }
}
