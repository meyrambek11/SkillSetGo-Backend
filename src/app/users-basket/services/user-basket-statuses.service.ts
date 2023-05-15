import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserBasketStatus,
  UserBasketStatusCodes,
} from '../entities/user-basket-statuses.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserBasketStatusService {
  constructor(
    @InjectRepository(UserBasketStatus)
    private userBasketStatusRepository: Repository<UserBasketStatus>,
  ) {}

  async getOneByCode(code: UserBasketStatusCodes): Promise<UserBasketStatus> {
    return await this.userBasketStatusRepository.findOne({
      where: { code },
    });
  }

  async getAll(): Promise<UserBasketStatus[]> {
    return await this.userBasketStatusRepository.find();
  }
}
