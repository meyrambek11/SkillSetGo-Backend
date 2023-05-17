import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseDto } from './orders.dto';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { UserMetadata } from 'src/common/types/userMetadata';
import { OrderService } from './services/orders.service';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(private oerderService: OrderService){}

    @Post('response')
    responseToTask(
        @Body() payload: ResponseDto,
        @UserInfo() user: UserMetadata
    ){
        return this.oerderService.responseToTask(user, payload);
    }
}
