import { Body, Controller, Get, Param, Req, Request } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CreateMessagesDto } from './DTO/create-messages.dto';
import { MessagesService } from './messages.service';
import { UUID } from 'crypto';
import {
  InterlocutorIdParam,
  PageParam,
} from './ExampleDataSwagger/exampleSenderReceiver';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { MessagesEntity } from './messages.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
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
  // new endpoint
  @Get('/interlocutors/:interlocutorid/:page')
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
  @ApiOperation({ summary: 'Show messages' })
  @ApiResponse({
    status: 200,
    description: 'Messages have been fetched successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'b5264943-2b05-4056-a97d-3c5444fa5a8c',
          },
          receiverId: {
            type: 'string',
            example: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
          },
          senderId: {
            type: 'string',
            example: '13fc7f3a-e49f-453a-9f99-883d62e51ac7',
          },
          content: { type: 'string', example: 'Hi :)' },
          sentAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-03-20T13:03:47.052Z',
          },
        },
      },
      example: [
        {
          id: 'b5264943-2b05-4056-a97d-3c5444fa5a8c',
          receiverId: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
          senderId: '13fc7f3a-e49f-453a-9f99-883d62e51ac7',
          content: 'Hi :)',
          sentAt: '2025-03-20T13:03:47.052Z',
        },
        {
          id: '7935a97f-5510-4046-8a44-4758e0907184',
          receiverId: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
          senderId: '13fc7f3a-e49f-453a-9f99-883d62e51ac7',
          content: 'Hi :)',
          sentAt: '2025-03-20T13:03:46.858Z',
        },
        'baśka',
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid interlocutor id',
  })
  @ApiParam(InterlocutorIdParam)
  @ApiParam(PageParam)
  showMessage(
    @Param('interlocutorid') interlocutorID: UUID,
    @Param('page') pagesNumber: number,
    @Req() request: Request,
  ) {
    const myId: UUID = request['user'].sub;
    return this.messagesService.showMessages(myId, interlocutorID, pagesNumber);
  }

  @Get()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Messages have been fetched successfully',
    schema: {
      type: 'array',

      properties: {
        id: { type: 'string', example: 'b5264943-2b05-4056-a97d-3c5444fa5a8c' },
        receiverId: {
          type: 'string',
          example: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
        },
        senderId: {
          type: 'string',
          example: '13fc7f3a-e49f-453a-9f99-883d62e51ac7',
        },
        content: { type: 'string', example: 'Hi :)' },
        sentAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-03-20T13:03:47.052Z',
        },
        partnerId: {
          type: 'string',
          example: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
        },
        partnerNickName: { type: 'string', example: 'baśka' },
      },

      example: [
        {
          id: 'b5264943-2b05-4056-a97d-3c5444fa5a8c',
          receiverId: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
          senderId: '13fc7f3a-e49f-453a-9f99-883d62e51ac7',
          content: 'Hi :)',
          sentAt: '2025-03-20T13:03:47.052Z',
          partnerId: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
          partnerNickName: 'baśka',
        },
        {
          id: '7935a97f-5510-4046-8a44-4758e0907184',
          receiverId: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
          senderId: '13fc7f3a-e49f-453a-9f99-883d62e51ac7',
          content: 'Hi :)',
          sentAt: '2025-03-20T13:03:46.858Z',
          partnerId: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
          partnerNickName: 'baśka',
        },
      ],
    },
  })
  @ApiOperation({ summary: 'Show latest messages' })
  @ApiBadRequestResponse({
    description: 'Your JWT Token is invalid',
  })
  getMessages(@Request() req) {
    const UserId: UUID = req.user.sub;
    return this.messagesService.getMessages(UserId);
  }
}
