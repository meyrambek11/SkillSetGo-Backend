import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { UserMetadata } from 'src/common/types/userMetadata';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './users.dto';
import { User } from './users.entity';
import { Freelancer } from '../freelancers/entities/freelancers.entity';
import { DeleteResult } from 'typeorm';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('account')
  getAccount(
    @UserInfo() user: UserMetadata,
  ): Promise<User & { account: Freelancer | null }> {
    return this.usersService.getAccount(user);
  }

  @Patch()
  update(
    @UserInfo() user: UserMetadata,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(user, payload);
  }

  @Post('top-up-balance')
  topUpBalance(
    @UserInfo() user: UserMetadata,
    @Body('balance') balance: number,
  ): Promise<{ success: boolean }> {
    return this.usersService.increaseBalance(user.id, balance);
  }

  @Delete()
  delete(@UserInfo() user: UserMetadata): Promise<DeleteResult> {
    return this.usersService.delete(user);
  }
}
