import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { UserBasketStatusCodes } from './entities/user-basket-statuses.entity';
import { Task } from '../tasks/entities/tasks.entity';
import { Freelancer } from '../freelancers/entities/freelancers.entity';

export class StoreBasketDto {
  @IsNotEmpty()
  @IsEnum(UserBasketStatusCodes)
  statusCode: UserBasketStatusCodes;

  @IsOptional()
  @IsObject()
  task?: Task;

  @IsOptional()
  @IsObject()
  freelancer?: Freelancer;
}
