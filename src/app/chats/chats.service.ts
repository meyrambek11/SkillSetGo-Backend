import { Injectable } from '@nestjs/common';
import { StoreEventDto } from './chats.dto';
import { Event } from './chats.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async store(payload: StoreEventDto): Promise<Event> {
    const event = await this.eventRepository.save(payload);
    return await this.getOne(event.id);
  }

  async getOne(id: string): Promise<Event> {
    return await this.eventRepository.findOne({
      where: { id },
      relations: ['fromUser', 'toUser'],
    });
  }
}
