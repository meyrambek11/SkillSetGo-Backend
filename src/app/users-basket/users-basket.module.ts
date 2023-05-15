import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBasket } from './entities/users-basket.entity';
import { UserBasketStatus } from './entities/user-basket-statuses.entity';
import { UserBasketController } from './users-basket.controller';
import { UserBasketService } from './services/users-basket.service';
import { UserBasketStatusService } from './services/user-basket-statuses.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserBasket, UserBasketStatus]),
  ],
  controllers: [UserBasketController],
  providers: [UserBasketService, UserBasketStatusService],
})
export class UsersBasketModule {}
