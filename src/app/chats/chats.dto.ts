import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { EventTypes } from './chats.entity';

export class StoreEventDto {
  @IsEnum(EventTypes)
  @IsNotEmpty()
  type: EventTypes;

  @IsNotEmpty()
  @IsObject()
  fromUser: { id: string };

  @IsNotEmpty()
  @IsObject()
  toUser: { id: string };

  @IsNotEmpty()
  value: object | object[];
}
