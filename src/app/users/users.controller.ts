import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import AdministrationGuard from '../admin/admin.guard';

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

  @Get()
  @UseGuards(AdministrationGuard())
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
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

  @Post('block/:userId')
  @UseGuards(AdministrationGuard())
  blockUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ success: boolean }> {
    return this.usersService.blockUser(userId);
  }

  @Post('unlock/:userId')
  @UseGuards(AdministrationGuard())
  unlockUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ success: boolean }> {
    return this.usersService.unlockUser(userId);
  }

  @Delete()
  delete(@UserInfo() user: UserMetadata): Promise<DeleteResult> {
    return this.usersService.delete(user);
  }
}
