import { Body, Controller, Get, Param, Req, Request } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CreateMessagesDto } from './DTO/create-messages.dto';
import { MessagesService } from './messages.service';
import { UUID } from 'crypto';
import { InterlocutorIdParam } from './ExampleDataSwagger/exampleSenderReceiver';
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
  sentMessage(
    @Req() request: Request,
    @Body() createMessageDto: CreateMessagesDto,
  ) {
    return this.messagesService.sendMessage(
      createMessageDto.receiverId,
      request['user'].sub,
      createMessageDto.content,
    );
  }

  @Get(':interlocutorid')
  @ApiOperation({ summary: 'Show messages' })
  @ApiResponse({
    status: 200,
    description: 'Message has been fetched succesfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid interlocutor id',
  })
  @ApiParam(InterlocutorIdParam)
  showMessage(
    @Param('interlocutorid') interlocutorID: UUID,
    @Req() request: Request,
  ) {
    const myId: UUID = request['user'].sub;
    return this.messagesService.showMessages(myId, interlocutorID);
  }

  @Get()
  getMessages(@Request() req) {
    const UserId: UUID = req.user.sub;
    return this.messagesService.getMessages(UserId);
  }
}
