import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { MessagesEntity } from './messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private messagesRepository: Repository<MessagesEntity>,
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
      throw new BadRequestException();
    }
  }

  async showMessages(receiverId: UUID, senderId: UUID) {
    try {
      const messagesToGet = await this.messagesRepository.find({
        where: {
          receiverId: receiverId,
          senderId: senderId,
        },
        order: {
          sentAt: 'DESC',
        },
      });
      return messagesToGet;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
