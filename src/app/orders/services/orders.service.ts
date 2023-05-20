import { Injectable } from '@nestjs/common';
import { UserMetadata } from 'src/common/types/userMetadata';
import { ResponseDto, ReviewDto } from '../orders.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/orders.entity';
import { Repository } from 'typeorm';
import { FreelancerService } from 'src/app/freelancers/services/freelancers.service';
import { TaskService } from 'src/app/tasks/services/tasks.service';
import { OrderStatusService } from './order-statuses.service';
import { OrderStatusCodes } from '../entities/order-statuses.entity';
import { RoleCodes } from 'src/app/roles/roles.entity';
import { UsersService } from 'src/app/users/users.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private freelancerService: FreelancerService,
    private taskService: TaskService,
    private orderStatusService: OrderStatusService,
    private userService: UsersService,
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
        relations: ['task', 'freelancer', 'freelancer.user', 'status'],
      });

    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );

    return await this.orderRepository.find({
      where: { status: { code }, freelancer: { id: freelancer.id } },
      relations: ['task', 'customer', 'status'],
    });
  }

  async acceptOrder(
    user: UserMetadata,
    id: string,
  ): Promise<{ success: boolean }> {
    const order = await this.orderRepository.findOne({
      where: {
        customer: { id: user.id },
        id,
        status: { code: OrderStatusCodes.NEW },
      },
      relations: ['task'],
    });

    if (!order) return { success: false };

    const status = await this.orderStatusService.getOneByCode(
      OrderStatusCodes.ACTIVE,
    );

    await this.orderRepository.update(order.id, {
      status,
    });

    await this.taskService.changeStatusToAppoint(order.task.id);

    return { success: true };
  }

  async rejectOrder(
    user: UserMetadata,
    id: string,
  ): Promise<{ success: boolean }> {
    const order = await this.orderRepository.findOne({
      where: { customer: { id: user.id }, id },
      relations: ['task'],
    });

    if (!order) return { success: false };

    const status = await this.orderStatusService.getOneByCode(
      OrderStatusCodes.REJECT,
    );

    await this.orderRepository.update(order.id, {
      status,
    });

    return { success: true };
  }

  async reviewOrder(
    user: UserMetadata,
    id: string,
    payload: ReviewDto,
  ): Promise<{ success: boolean }> {
    const freelancer = await this.freelancerService.getOneByUserWithRelations(
      user.id,
    );

    if (!freelancer) return { success: false };

    const order = await this.orderRepository.findOne({
      where: {
        id,
        freelancer: { id: freelancer.id },
        status: { code: OrderStatusCodes.ACTIVE },
      },
    });

    if (!order) return { success: false };

    const status = await this.orderStatusService.getOneByCode(
      OrderStatusCodes.REVIEW,
    );

    await this.orderRepository.update(order.id, {
      ...payload,
      status,
    });

    return { success: true };
  }

  async compliteOrder(
    user: UserMetadata,
    id: string,
  ): Promise<{ success: boolean }> {
    const order = await this.orderRepository.findOne({
      where: {
        customer: { id: user.id },
        id,
        status: { code: OrderStatusCodes.REVIEW },
      },
      relations: ['customer', 'freelancer', 'freelancer.user'],
    });

    if (!order) return { success: false };

    const customerBalance = await this.userService.getBalance(
      order.customer.id,
    );

    if (customerBalance < order.price) return { success: false };

    //снять с счета заказчика
    await this.userService.decreaseBalance(order.customer.id, order.price);

    //пополнить счет фрилансера
    await this.userService.increaseBalance(
      order.freelancer.user.id,
      order.price * 0.9,
    );

    //пополнить счет админа
    const admin = await this.userService.getAdmin();
    await this.userService.increaseBalance(admin.id, order.price * 0.1);

    const status = await this.orderStatusService.getOneByCode(
      OrderStatusCodes.COMPLITED,
    );

    await this.orderRepository.update(order.id, { status });

    return { success: true };
  }
}
