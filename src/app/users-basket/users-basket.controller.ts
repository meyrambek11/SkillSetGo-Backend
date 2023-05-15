import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { UserMetadata } from 'src/common/types/userMetadata';
import { StoreBasketDto } from './users-basket.dto';
import { UserBasketService } from './services/users-basket.service';
import { UserBasket } from './entities/users-basket.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UserBasketStatus,
  UserBasketStatusCodes,
} from './entities/user-basket-statuses.entity';
import { UserBasketStatusService } from './services/user-basket-statuses.service';
import { DeleteResult } from 'typeorm';

@UseGuards(JwtAuthGuard)
@Controller('basket')
export class UserBasketController {
  constructor(
    private basketService: UserBasketService,
    private basketStatusService: UserBasketStatusService,
  ) {}

  @Get('statuses')
  getAllStatuses(): Promise<UserBasketStatus[]> {
    return this.basketStatusService.getAll();
  }

  @Post()
  store(
    @UserInfo() user: UserMetadata,
    @Body() payload: StoreBasketDto,
  ): Promise<UserBasket> {
    return this.basketService.store(user, payload);
  }

  @Get('/:code')
  getManyWithCode(
    @Param('code') code: UserBasketStatusCodes,
    @UserInfo() user: UserMetadata,
  ): Promise<UserBasket[]> {
    return this.basketService.getManyWithCode(code, user);
  }

  @Delete('/:id')
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @UserInfo() user: UserMetadata,
  ): Promise<DeleteResult> {
    return this.basketService.delete(id, user);
  }
}
