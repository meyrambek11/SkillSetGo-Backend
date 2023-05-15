import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateaway';
import { ChatController } from './chats.controller';
import { ChatService } from './chats.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './chats.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Event])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatsModule {}
