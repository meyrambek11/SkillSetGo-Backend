import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { UserMetadata } from 'src/common/types/userMetadata';
import { CustomerService } from './customers.service';
import { GetAllResponse } from 'src/common/types/get-all.response';
import { Task } from '../tasks/entities/tasks.entity';
import { TaskStatusCodes } from '../tasks/entities/task-statuses.entity';

@UseGuards(JwtAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('/:code')
  getTasks(
    @UserInfo() user: UserMetadata,
    @Param('code') code: TaskStatusCodes,
  ): Promise<GetAllResponse<Task>> {
    return this.customerService.getTasks(user, code);
  }
}
