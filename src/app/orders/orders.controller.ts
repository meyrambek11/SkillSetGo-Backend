import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseDto } from './orders.dto';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { UserMetadata } from 'src/common/types/userMetadata';
import { OrderService } from './services/orders.service';
import { OrderStatusCodes } from './entities/order-statuses.entity';
import { Order } from './entities/orders.entity';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private oerderService: OrderService) {}

  @Post()
  responseToTask(@Body() payload: ResponseDto, @UserInfo() user: UserMetadata) {
    return this.oerderService.responseToTask(user, payload);
  }

  @Get('own/:code')
  getOwnByCode(
    @UserInfo() user: UserMetadata,
    @Param('code') code: OrderStatusCodes,
  ): Promise<Order[]> {
    return this.oerderService.getAllByCode(user, code);
  }
}
