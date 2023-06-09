import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { OrderService } from './services/orders.service';
import { OrderStatusService } from './services/order-statuses.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { OrderStatus } from './entities/order-statuses.entity';
import { FreelancersModule } from '../freelancers/freelancers.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Order, OrderStatus]),
    FreelancersModule,
    TasksModule,
    UsersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderStatusService],
})
export class OrdersModule {}
