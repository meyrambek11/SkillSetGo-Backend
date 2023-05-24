import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReferencesService } from '../../references/references.service';
import { AvailabilityStatusCodes } from '../../references/entities/availability-status.entity';
import { CurrencyCodes } from '../../references/entities/currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Freelancer } from '../entities/freelancers.entity';
import {
  Brackets,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { User } from '../../users/users.entity';
import { UserMetadata } from 'src/common/types/userMetadata';
import { GetAllFreelancerQuery, UpdateFreelancerDto } from '../freelancers.dto';
import { GetAllResponse } from 'src/common/types/get-all.response';

@Injectable()
export class FreelancerService {
  constructor(
    @InjectRepository(Freelancer)
    private freelancerRepository: Repository<Freelancer>,
    private referencesService: ReferencesService,
  ) {}

  async store(user: User): Promise<Freelancer> {
    const availabilityStatus =
      await this.referencesService.getAvailabilityStatusByCode(
        AvailabilityStatusCodes.FREE,
      );
    const currency = await this.referencesService.getCurrencyByCode(
      CurrencyCodes.TENGE,
    );
    return await this.freelancerRepository.save({
      user,
      availabilityStatus,
      currency,
    });
  }

  async getAll(
    query: GetAllFreelancerQuery,
    user: UserMetadata,
  ): Promise<GetAllResponse<Freelancer>> {
    let freelancersQuery = this.freelancerRepository
      .createQueryBuilder('freelancer')
      .orderBy('freelancer.created_at', 'ASC')
      .leftJoinAndSelect('freelancer.user', 'user')
      .leftJoinAndSelect('user.country', 'country')
      .leftJoinAndSelect('user.city', 'city')
      .leftJoinAndSelect('freelancer.availabilityStatus', 'availabilityStatus')
      .leftJoinAndSelect('freelancer.specializations', 'specializations')
      .leftJoinAndSelect('specializations.category', 'specializationCategory')
      .leftJoinAndSelect('freelancer.baskets', 'baskets')
      .leftJoinAndSelect('baskets.user', 'likedUser');

    freelancersQuery = this.filteringReceivedData(freelancersQuery, query);
    freelancersQuery = this.searchingReceivedData(
      freelancersQuery,
      query.keyword,
    );

    const freelancers = await freelancersQuery.getMany();

    for (const freelancer of freelancers) {
      freelancer['isLike'] = false;
      for (const basket of freelancer.baskets) {
        if (basket.user.id === user.id) {
          freelancer['isLike'] = true;
          break;
        }
      }
      delete freelancer.baskets;
    }

    return {
      data: freelancers,
      meta: {
        total: freelancers.length,
        page: null,
        limit: null,
      },
    };
  }

  async getOne(id: string): Promise<Freelancer> {
    return await this.freelancerRepository.findOne({
      where: { id },
      relations: [
        'user',
        'user.country',
        'user.city',
        'availabilityStatus',
        'specializations',
        'educations',
        'languages',
        'languages.language',
        'languages.languageDegree',
        'experiences',
        'workExperiences',
      ],
    });
  }

  async getOneByUser(userId: string): Promise<Freelancer> {
    return await this.freelancerRepository.findOne({
      where: { user: { id: userId } },
      relations: [
        'availabilityStatus',
        'specializations',
        'educations',
        'languages',
        'languages.language',
        'languages.languageDegree',
        'experiences',
        'workExperiences',
      ],
    });
  }

  async getOneByUserWithRelations(
    userId: string,
    relations: string[] = [],
  ): Promise<Freelancer> {
    const freelancer = await this.freelancerRepository.findOne({
      where: { user: { id: userId } },
      relations,
    });

    if (!freelancer)
      throw new HttpException(
        `Freelancer with user id: ${userId} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    return freelancer;
  }

  async update(
    user: UserMetadata,
    payload: UpdateFreelancerDto,
  ): Promise<Freelancer> {
    const freelancer = await this.freelancerRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!freelancer)
      throw new HttpException(
        `Freelancer with user id: ${user.id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );

    await this.freelancerRepository.save({
      id: freelancer.id,
      ...payload,
    });

    return await this.getOneByUser(user.id);
  }

  filteringReceivedData(
    freelancersQuery: SelectQueryBuilder<Freelancer>,
    query: GetAllFreelancerQuery,
  ): SelectQueryBuilder<Freelancer> {
    if (query.fromPricePerHour)
      freelancersQuery.andWhere('freelancer.pricePerHour >= :from', {
        from: query.fromPricePerHour,
      });

    if (query.toPricePerHour)
      freelancersQuery.andWhere('freelancer.pricePerHour <= :to', {
        to: query.toPricePerHour,
      });

    if (query.availabilityStatusId)
      freelancersQuery.andWhere('availabilityStatus.id = :id', {
        id: query.availabilityStatusId,
      });
    if (query.specializationCategoryId)
      freelancersQuery.andWhere('specializationCategory.id = :categoryId', {
        categoryId: query.specializationCategoryId,
      });

    return freelancersQuery;
  }

  searchingReceivedData(
    freelancersQuery: SelectQueryBuilder<Freelancer>,
    keyword: string,
  ): SelectQueryBuilder<Freelancer> {
    if (keyword === '') return freelancersQuery;

    freelancersQuery.andWhere(
      new Brackets((qb) => {
        qb.where("freelancer.title Ilike '%' || :title || '%'", {
          title: keyword,
        });
        qb.orWhere("freelancer.description Ilike '%' || :description || '%'", {
          description: keyword,
        });
      }),
    );

    return freelancersQuery;
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.freelancerRepository.softDelete(id);
  }
}
