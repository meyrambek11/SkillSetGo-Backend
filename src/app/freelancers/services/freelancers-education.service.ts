import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { StoreFreelancerEducationDto } from '../freelancers.dto';
import { UserMetadata } from 'src/common/types/userMetadata';
import { FreelancerService } from './freelancers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FreelancerEducation } from '../entities/freelancer-educations.entity';

@Injectable()
export class FreelancerEducationService {
  constructor(
    private freelancerService: FreelancerService,
    @InjectRepository(FreelancerEducation)
    private freelancerEducationRepository: Repository<FreelancerEducation>,
  ) {}

  async store(
    payload: StoreFreelancerEducationDto,
    user: UserMetadata,
  ): Promise<FreelancerEducation> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );

    if(!freelancer)
      throw new HttpException(
        `Freelancer with user id: ${user.id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    return await this.freelancerEducationRepository.save({
      freelancer,
      ...payload,
    });
  }

  async delete(id: string, user: UserMetadata): Promise<DeleteResult> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );

    const education = await this.freelancerEducationRepository.findOne({
      where: { id, freelancer: { id: freelancer.id } },
    });

    if (!education)
      throw new HttpException(
        `Education with id: ${id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );

    return await this.freelancerEducationRepository.delete(id);
  }
}
