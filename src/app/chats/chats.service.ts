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

  async getMessages(ownerId: string, companionId: string): Promise<Event[]> {
    const eventsQuery = this.eventRepository
      .createQueryBuilder('event')
      .orderBy('event.created_at', 'ASC')
      .leftJoinAndSelect('event.toUser', 'toUser')
      .leftJoinAndSelect('event.fromUser', 'fromUser')
      .where('(toUser.id = :ownerId AND fromUser.id = :companionId)', {
        ownerId,
        companionId,
      })
      .orWhere('(toUser.id = :companionId AND fromUser.id = :ownerId)', {
        companionId,
        ownerId,
      });

    return await eventsQuery.getMany();
  }

  async deleteMessage(
    id: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    const event = await this.eventRepository.findOne({
      where: { id, fromUser: { id: userId } },
    });

    if (!event) return { success: false };

    await this.eventRepository.softDelete(id);
    return { success: true };
  }
}
