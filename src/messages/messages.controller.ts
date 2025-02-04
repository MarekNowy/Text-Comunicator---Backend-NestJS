import { Body, Controller, Get } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CreateMessagesDto } from './DTO/create-messages.dto';
import { MessagesService } from './messages.service';
import { UUID } from 'crypto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  sentMessage(@Body() createMessageDto: CreateMessagesDto) {
    return this.messagesService.sendMessage(
      createMessageDto.receiverId,
      createMessageDto.senderId,
      createMessageDto.content,
    );
  }

  @Post('/show')
  showMessage(@Body() data: { receiverId: UUID; senderId: UUID }) {
    return this.messagesService.showMessages(data.receiverId, data.senderId);
  }
}
