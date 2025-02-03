import { Injectable, Res } from '@nestjs/common';
import { MessagesEntity } from './messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private messagesRepository: Repository<MessagesEntity>,
  ) {}

  async sendMessage(receiverId: number, senderId: number, content: string) {

    try{
    const newMessage = new MessagesEntity();
    newMessage.receiverId = receiverId;
    newMessage.senderId = senderId;
    newMessage.content = content;
    newMessage.sentAt = new Date();

    const sentMessage = await this.messagesRepository.save(newMessage);
    return sentMessage;
    } catch (error){
      throw new Error("failed to send message")
    }
  }

  async showMessages(receiverId: number, senderId:number){
    try{
    const messagesToGet = await this.messagesRepository.find({
        where: {
            receiverId: receiverId,
            senderId: senderId
        }
    })
    messagesToGet.sort(function(a,b){
    return b.sentAt.getTime() - a.sentAt.getTime()
    })
    return messagesToGet;
  } catch(error){
    throw new Error("failed to show messages")
  }

    
  }
}
