import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MessagesEntity } from './messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { UserEntity } from 'src/users/users.entity';
import { skip } from 'rxjs';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private messagesRepository: Repository<MessagesEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async sendMessage(receiverId: UUID, senderId: UUID, content: string) {
    try {
      const newMessage = this.messagesRepository.create({
        receiverId: receiverId,
        senderId: senderId,
        content: content,
      });
      const sentMessage = await this.messagesRepository.save(newMessage);
      return sentMessage;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async showMessages(myId: UUID, interlocutorId: UUID, pagesNumber: number) {
    try {
      const messagesToGet = await this.messagesRepository.find({
        where: [
          { receiverId: myId, senderId: interlocutorId },
          { receiverId: interlocutorId, senderId: myId },
        ],
        order: {
          sentAt: 'DESC',  
        },
        skip: pagesNumber * 20,  
        take: 20,  
      });
      
      const partner:any = await this.userRepository.findOne({where: {
      id: interlocutorId
      }});
      messagesToGet.push(partner.nickName || "NickName")
      return messagesToGet;  
    }
      catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

async getMessages(userId: UUID): Promise<any[]>{
  const messages = await this.messagesRepository.find({
    where: [
      { senderId: userId },
      { receiverId: userId }
    ],
    order: {
      sentAt: 'DESC',  
    }
  });
  
  const lastMessages: any[] = [];

  const uniqueConversation = new Set();

  for(const message of messages){
    if(message.content.length >30) {message.content = message.content.slice(0,30) + "..."} 
    const partnerId = message.senderId === userId ? message.receiverId : message.senderId
  
    if(!uniqueConversation.has(partnerId)){
      const partner = await this.userRepository.findOne({
        where: {
          id: partnerId
        }
      })
      
      lastMessages.push({...message,
      partnerId: partnerId,
      partnerNickName: partner?.nickName})
      uniqueConversation.add(partnerId)
    }
    
  }
  return lastMessages;
}  

}
