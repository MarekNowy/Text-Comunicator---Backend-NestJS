import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { randomUUID, UUID } from "crypto";
import { Server } from "http";
import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { generate } from "rxjs";
import { MongoMissingCredentialsError } from "typeorm";
import { use } from "passport";

let userId: UUID 
let socketId: string
let userIdSocketId = new Map()

interface Payload {
    id: UUID,
    receiverId: UUID,
    senderId: UUID,
    content: any,
    sentAt: Date
}

const findKeyFromValue = (map:Map<UUID,string>, value: any) => {
for (let[key,val] of map) {
    if(val === value){
        return key;
    }
}
}

@WebSocketGateway({cors: {origin:'http://localhost:5173'}})
export class ChatGateway {
    
    @WebSocketServer() server: any

    constructor(private readonly jwtService: JwtService) {}
    
    handleConnection(client: Socket): void{
        socketId = client.id 
        let token = client.handshake.query.token
        let decoded = this.jwtService.verify(token as string)
        userId = decoded.sub
        userIdSocketId.set(userId,socketId)
    }
   
    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() body){
    let clientSocketId: string = client.id;
    let clientId:any = findKeyFromValue(userIdSocketId,clientSocketId)
    let receiverId:UUID = body.toUserId;
    let content: any = body.message;
    let receiverSocketId: string = userIdSocketId.get(receiverId); 
    let currentTime: Date = new Date();

    const payload: Payload = {
        id: randomUUID(),
        receiverId: receiverId, 
        senderId: clientId,
        content: content,
        sentAt: currentTime
    }
    const bothOfUsers: string[] = [receiverSocketId,clientSocketId]
    for(const user of bothOfUsers){
     if(user){ 
        console.log(user)
        this.server.to(user).emit('message', payload)};
     }}

  
}
   

