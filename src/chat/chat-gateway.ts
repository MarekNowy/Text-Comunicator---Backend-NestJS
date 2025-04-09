import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID, UUID } from 'crypto';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

let userId: UUID;
let socketId: string;
const userIdSocketId = new Map();

interface Payload {
  id: UUID;
  receiverId: UUID;
  senderId: UUID;
  content: any;
  sentAt: Date;
  fromUser: string;
  toUser: string;
}

const findKeyFromValue = (map: Map<UUID, string>, value: any) => {
  for (const [key, val] of map) {
    if (val === value) {
      return key;
    }
  }
};

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class ChatGateway {
  @WebSocketServer() server: any;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket): void {
    socketId = client.id;
    const token = client.handshake.query.token;
    const decoded = this.jwtService.verify(token as string);
    userId = decoded.sub;
    userIdSocketId.set(userId, socketId);
  }
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() body) {
    const clientSocketId: string = client.id;
    const clientId: any = findKeyFromValue(userIdSocketId, clientSocketId);
    const decodeToken = this.jwtService.verify(body.fromToken as string);
    const nickName = decodeToken.username;
    const receiverId: UUID = body.toUserId;
    const content: any = body.message;
    const receiverSocketId: string = userIdSocketId.get(receiverId);
    const currentTime: Date = new Date();
    const toUser = body.toUser;

    const payload: Payload = {
      id: randomUUID(),
      receiverId: receiverId,
      senderId: clientId,
      content: content,
      sentAt: currentTime,
      fromUser: nickName,
      toUser: toUser,
    };
    let bothOfUsers: string[] = [];

    if (receiverSocketId === clientSocketId) {
      bothOfUsers = [receiverSocketId];
    } else {
      bothOfUsers = [receiverSocketId, clientSocketId];
    }

    for (const user of bothOfUsers) {
      if (user) {
        this.server.to(user).emit('message', payload);
      }
    }
  }
  @SubscribeMessage('removeAccount')
  handleRemoveAccount(@MessageBody() body) {
    const removeId = body.accountId;
    this.server.emit('removeAccount', removeId);
  }
}
