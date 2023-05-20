import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseDto, ReviewDto } from './orders.dto';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { UserMetadata } from 'src/common/types/userMetadata';
import { OrderService } from './services/orders.service';
import {
  OrderStatus,
  OrderStatusCodes,
} from './entities/order-statuses.entity';
import { Order } from './entities/orders.entity';
import { OrderStatusService } from './services/order-statuses.service';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private orderStatusService: OrderStatusService,
  ) {}

  @Get('statuses')
  orderStatuses(): Promise<OrderStatus[]> {
    return this.orderStatusService.getAll();
  }

  @Post('response')
  responseToTask(@Body() payload: ResponseDto, @UserInfo() user: UserMetadata) {
    return this.orderService.responseToTask(user, payload);
  }

  @Get('own/:code')
  getOwnByCode(
    @UserInfo() user: UserMetadata,
    @Param('code') code: OrderStatusCodes,
  ): Promise<Order[]> {
    return this.orderService.getAllByCode(user, code);
  }

  @Post('accept/:id')
  acceptOrder(
    @UserInfo() user: UserMetadata,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    return this.orderService.acceptOrder(user, id);
  }

  @Post('reject/:id')
  rejectOrder(
    @UserInfo() user: UserMetadata,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    return this.orderService.rejectOrder(user, id);
  }

  @Post('review/:id')
  reviewOrder(
    @UserInfo() user: UserMetadata,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: ReviewDto,
  ): Promise<{ success: boolean }> {
    return this.orderService.reviewOrder(user, id, payload);
  }

  @Post('complite/:id')
  compliteOrder(
    @UserInfo() user: UserMetadata,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    return this.orderService.compliteOrder(user, id);
  }
}
