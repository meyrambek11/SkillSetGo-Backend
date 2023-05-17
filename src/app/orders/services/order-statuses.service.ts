import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OrderStatus,
  OrderStatusCodes,
} from '../entities/order-statuses.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private orderStatusRepository: Repository<OrderStatus>,
  ) {}

  async getOneByCode(code: OrderStatusCodes): Promise<OrderStatus> {
    return await this.orderStatusRepository.findOne({
      where: { code },
    });
  }
}
