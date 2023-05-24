import { IsNotEmpty, IsObject } from 'class-validator';

export class StoreEventDto {
  @IsNotEmpty()
  @IsObject()
  fromUser: { id: string };

  @IsNotEmpty()
  @IsObject()
  toUser: { id: string };

  @IsNotEmpty()
  message: string;
}
