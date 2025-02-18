import { Body, Controller, Get, Param } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CreateMessagesDto } from './DTO/create-messages.dto';
import { MessagesService } from './messages.service';
import { UUID } from 'crypto';
import {
  ReceiverIdParam,
  SenderIdParam,
} from './ExampleDataSwagger/exampleSenderReceiver';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiParam,
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
    type: MessagesEntity,
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

  @Get(':receiverId/:senderId')
  @ApiOperation({ summary: 'Show messages' })
  @ApiResponse({
    status: 200,
    description: 'Message has been fetched succesfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid receiver or sender ID',
  })
  @ApiParam(ReceiverIdParam)
  @ApiParam(SenderIdParam)
  showMessage(
    @Param('senderId') senderId: UUID,
    @Param('receiverId') receiverId: UUID,
  ) {
    return this.messagesService.showMessages(senderId, receiverId);
  }
}
