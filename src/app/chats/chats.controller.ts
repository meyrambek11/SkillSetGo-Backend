import { Controller, Get } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Get()
  getMessage(): string {
    return 'success';
  }
}
