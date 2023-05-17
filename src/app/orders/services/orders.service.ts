import { Injectable } from '@nestjs/common';
import { UserMetadata } from 'src/common/types/userMetadata';
import { ResponseDto } from '../orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/orders.entity';
import { Repository } from 'typeorm';
import { FreelancerService } from 'src/app/freelancers/services/freelancers.service';
import { TaskService } from 'src/app/tasks/services/tasks.service';
import { OrderStatusService } from './order-statuses.service';
import { OrderStatusCodes } from '../entities/order-statuses.entity';
import { RoleCodes } from 'src/app/roles/roles.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private freelancerService: FreelancerService,
    private taskService: TaskService,
    private orderStatusService: OrderStatusService,
  ) {}

  async responseToTask(
    user: UserMetadata,
    payload: ResponseDto,
  ): Promise<{ success: boolean }> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );

    if (!freelancer) return { success: false };

    const task = await this.taskService.getOneWithUser(payload.task.id);

    if (!task) return { success: false };

    const order = await this.orderRepository.findOne({
      where: { freelancer: { id: freelancer.id }, task: { id: task.id } },
    });

    if (order) return { success: true };

    const status = await this.orderStatusService.getOneByCode(
      OrderStatusCodes.NEW,
    );

    await this.orderRepository.save({
      ...payload,
      freelancer: { id: freelancer.id },
      customer: { id: task.user.id },
      status,
    });

    return { success: true };
  }

  async getAllByCode(
    user: UserMetadata,
    code: OrderStatusCodes,
  ): Promise<Order[]> {
    if (user.role.code == RoleCodes.CUSTOMER)
      return await this.orderRepository.find({
        where: { status: { code }, customer: { id: user.id } },
        relations: ['task', 'freelancer', 'status'],
      });

    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );

    return await this.orderRepository.find({
      where: { status: { code }, freelancer: { id: freelancer.id } },
      relations: ['task', 'customer', 'status'],
    });
  }
}
