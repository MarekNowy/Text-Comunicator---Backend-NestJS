import { Body, Controller} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CreateMessagesDto } from './DTO/create-messages.dto';
import { MessagesService } from './messages.service';
import { UUID } from 'crypto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { MessagesEntity } from './messages.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({
    summary: 'Sent message',
    description: 'Send message to user by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Message has been sent successfully',
    type: [MessagesEntity],
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid receiver or sender ID',
  })
  sentMessage(@Body() createMessageDto: CreateMessagesDto) {
    return this.messagesService.sendMessage(
      createMessageDto.receiverId,
      createMessageDto.senderId,
      createMessageDto.content,
    );
  }

  @Post('/show')
  @ApiOperation({ summary: 'Show messages' })
  @ApiResponse({
    status: 200,
    description: 'Message has been fetched succesfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid receiver or sender ID',
  })
  @ApiBody({
    description: 'Data for display the messages',
    schema: {
      type: 'object',
      properties: {
        receiverId: {
          type: 'UUID',
          example: '7c5b801a-dd56-429d-86de-0df563368292',
        },
        senderId: {
          type: 'UUID',
          example: '0daca3f6-094e-4340-b1bf-18ed2329c2f9',
        },
      },
    },
  })
  showMessage(@Body() data: { receiverId: UUID; senderId: UUID }) {
    return this.messagesService.showMessages(data.receiverId, data.senderId);
  }
}
