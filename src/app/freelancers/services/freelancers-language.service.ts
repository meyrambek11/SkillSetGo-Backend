import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StoreFreelancerLanguageDto } from '../freelancers.dto';
import { UserMetadata } from 'src/common/types/userMetadata';
import { InjectRepository } from '@nestjs/typeorm';
import { FreelancerService } from './freelancers.service';
import { FreelancerLanguage } from '../entities/freelancer-languages.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class FreelancerLanguageService {
  constructor(
    private freelancerService: FreelancerService,
    @InjectRepository(FreelancerLanguage)
    private freelancerLanguageRepository: Repository<FreelancerLanguage>,
  ) {}

  async store(
    payload: StoreFreelancerLanguageDto,
    user: UserMetadata,
  ): Promise<FreelancerLanguage> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );
    return await this.freelancerLanguageRepository.save({
      freelancer,
      ...payload,
    });
  }

  async delete(id: string, user: UserMetadata): Promise<DeleteResult> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );
    const language = await this.freelancerLanguageRepository.findOne({
      where: { id, freelancer: { id: freelancer.id } },
    });

    if (!language)
      throw new HttpException(
        `Language with id: ${id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    return await this.freelancerLanguageRepository.delete(id);
  }
}
