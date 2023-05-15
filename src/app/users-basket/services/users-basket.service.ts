import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserMetadata } from 'src/common/types/userMetadata';
import { StoreBasketDto } from '../users-basket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBasket } from '../entities/users-basket.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserBasketStatusService } from './user-basket-statuses.service';
import { UserBasketStatusCodes } from '../entities/user-basket-statuses.entity';

@Injectable()
export class UserBasketService {
  constructor(
    @InjectRepository(UserBasket)
    private userBasketRepository: Repository<UserBasket>,
    private basketStatusService: UserBasketStatusService,
  ) {}

  async store(
    user: UserMetadata,
    payload: StoreBasketDto,
  ): Promise<UserBasket> {
    const status = await this.basketStatusService.getOneByCode(
      payload.statusCode,
    );

    if (!status)
      throw new HttpException(
        `Basket status with code: ${payload.statusCode} does not exist`,
        HttpStatus.BAD_REQUEST,
      );

    return await this.userBasketRepository.save({
      user: { id: user.id },
      status,
      freelancer: payload.freelancer ? payload.freelancer : null,
      task: payload.task ? payload.task : null,
    });
  }

  async getManyWithCode(
    code: UserBasketStatusCodes,
    user: UserMetadata,
  ): Promise<UserBasket[]> {
    return code == UserBasketStatusCodes.FREELANCER
      ? await this.userBasketRepository.find({
          where: { status: { code }, user: { id: user.id } },
          relations: ['freelancer', 'freelancer.user'],
        })
      : await this.userBasketRepository.find({
          where: { status: { code }, user: { id: user.id } },
          relations: ['task'],
        });
  }

  async delete(id: string, user: UserMetadata): Promise<DeleteResult> {
    const basketElement = await this.userBasketRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!basketElement)
      throw new HttpException(
        `Element with id: ${id} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    return await this.userBasketRepository.softDelete(id);
  }
}
