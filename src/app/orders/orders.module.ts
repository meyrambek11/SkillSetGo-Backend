import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { OrderService } from './services/orders.service';
import { OrderStatusService } from './services/order-statuses.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderStatusService],
})
export class OrdersModule {}
