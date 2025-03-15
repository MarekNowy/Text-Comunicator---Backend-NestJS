import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UUID } from "crypto";
import { Server } from "http";
import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";

let userId: UUID 
let socketId: string
let userIdSocketId = new Map()
@WebSocketGateway({cors: {origin:'*'}})
export class ChatGateway {
   
    @WebSocketServer() server: Server

    constructor(private readonly jwtService: JwtService) {}
    
    handleConnection(client: Socket): void{
        // what if token == null?
        socketId = client.id
        let token = client.handshake.query.token
        let decoded = this.jwtService.verify(token as string)
        userId = decoded.sub
        userIdSocketId.set(userId,socketId)
    }

   

    @SubscribeMessage('message')
    handleMessage(@MessageBody() body){
    console.log(body)
    this.server.emit('message', body)
    }
   
}
