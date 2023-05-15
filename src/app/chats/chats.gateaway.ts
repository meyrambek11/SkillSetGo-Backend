import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chats.service';
import { EventTypes } from './chats.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private users: { [key: string]: string } = {};

  constructor(private chatService: ChatService) {}

  afterInit() {
    console.log('WebSocket initialized');
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    console.log(`User ${userId} joined`);
    this.users[userId] = client.id;
    console.log(this.users);
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { toUserId: string; message: string },
  ) {
    const fromUserId = Object.keys(this.users).find(
      (id) => this.users[id] === client.id,
    );

    //save to db
    const message = await this.chatService.store({
      type: EventTypes.message,
      fromUser: { id: fromUserId },
      toUser: { id: payload.toUserId },
      value: payload,
    });

    client.emit('message', message);

    const toClient = this.users[`${payload.toUserId}`];

    if (!toClient) {
      console.log(`User ${payload.toUserId} is not online`);
      return;
    }
    console.log(
      `Sending message from ${fromUserId} to ${payload.toUserId}: ${payload.message}`,
    );

    this.server.to(toClient).emit('message', message);

    //
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    const userId = Object.keys(this.users).find(
      (id) => this.users[id] === client.id,
    );
    if (userId) {
      delete this.users[userId];
      console.log(`User ${userId} disconnected`);
    }
  }
}
