import { Controller, Get, Request } from '@nestjs/common';
import { Post, Body, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './DTO/create-users.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { UserEntity } from './users.entity';
import { ChangeNickNameDto } from './DTO/change-nickName.dto';
import { Public } from 'src/auth/decorator/publicDecorator';
import { UUID } from 'crypto';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created',
    type: [UserEntity],
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  create(@Body() body: CreateUsersDto) {
    return this.userService.create(body.nickName, body.email, body.password);
  }

  @Delete()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User account has been successfully removed',
  })
  @ApiBadRequestResponse({
    description: 'Invalid user data',
  })
  @ApiBody({
    schema: {
      properties: {
        email: {
          type: 'string',
          example: 'example@example.com',
        },
        passport: {
          type: 'string',
          example: 'password',
        },
      },
    },
  })
  deleteAccount(
    @Request() req,
    @Body() data: { email: string; password: string },
  ) {
    const userId = req.user.sub;
    return this.userService.deleteAccount(userId, data.email, data.password);
  }

  @Patch()
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User nickname has been successfully updated',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  changeNickName(@Request() req, @Body() data: ChangeNickNameDto) {
    return this.userService.changeNickName(data.newNickName, req.user.sub);
  }

  @Get('/getinfo')
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User information has been successfully retrieved',
    type: UserEntity,
  })
  @ApiBadRequestResponse({
    description: 'Invalid JWT token',
  })
  @ApiBody({
    schema: {
      properties: {
        nickName: {
          type: 'string',
          example: 'nick123',
        },
        email: {
          type: 'string',
          example: 'example@example.com',
        },
        id: {
          type: 'UUID',
          example: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
        },
      },
    },
  })
  getInfo(@Request() req) {
    const UserId: UUID = req.user.sub;
    return this.userService.getInfo(UserId);
  }

  @Post('/showusers')
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Array of all users whose name starts with the letter you provided',
    schema: {
      properties: {
        nickName: {
          type: 'string',
          example: 'nick123',
        },
        email: {
          type: 'string',
          example: 'example@example.com',
        },
        id: {
          type: 'UUID',
          example: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
        },
      },
    },
  })
  @ApiBody({
    description: 'Nickname of the user you are looking for',
    schema: {
      properties: {
        nickName: {
          type: 'string',
          example: 'nick123',
        },
      },
    },
  })
  showUsers(@Body() body) {
    return this.userService.showUsers(body.nickName);
  }

  @Get('/stats')
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Array of all users whose name starts with the letter you provided',
    schema: {
      properties: {
        nickName: {
          type: 'string',
          example: 'nick123',
        },
        email: {
          type: 'string',
          example: 'example@example.com',
        },
        id: {
          type: 'UUID',
          example: 'fbe388e2-28fd-4427-92ff-79531f5593a6',
        },
        howManyMessages: {
          type: 'number',
          example: 100,
        },
        registerAt: {
          type: 'string',
          format: 'date-time',
          example: '2023-10-01',
        },
      },
    },
  })
  showStats(@Request() req) {
    const myId: UUID = req.user['sub'];
    return this.userService.showStats(myId);
  }
}
