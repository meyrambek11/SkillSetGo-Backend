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
  handleJoin(client: Socket, payload: { userId: string }) {
    console.log(
      `User with id: ${payload.userId} joined, clientId: ${client.id}`,
    );
    this.users[payload.userId] = client.id;
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
      fromUser: { id: fromUserId },
      toUser: { id: payload.toUserId },
      message: payload.message,
    });

    client.emit('message', message);

    const toClientId = this.users[`${payload.toUserId}`];

    if (!toClientId) {
      console.log(`User ${payload.toUserId} is not online`);
      return;
    }

    this.server.to(toClientId).emit('message', message);
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
