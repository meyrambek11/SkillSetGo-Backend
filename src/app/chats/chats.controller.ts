import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserInfo } from 'src/common/decorators/user.decorator';
import { ChatService } from './chats.service';
import { Event } from './chats.entity';
import { UserMetadata } from 'src/common/types/userMetadata';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  getMessage(
    @UserInfo() user: UserMetadata,
    @Query('companionId') companionId: string,
  ): Promise<Event[]> {
    return this.chatService.getMessages(user.id, companionId);
  }

  @Delete('/:id')
  deleteMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @UserInfo() user: UserMetadata,
  ): Promise<{ success: boolean }> {
    return this.chatService.deleteMessage(id, user.id);
  }
}
