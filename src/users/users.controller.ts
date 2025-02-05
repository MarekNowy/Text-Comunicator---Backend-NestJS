import {
  Controller
} from '@nestjs/common';
import { Post,  Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './DTO/create-users.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiResponse,
  ApiBody
} from '@nestjs/swagger';
import { UserEntity } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'User has been created succesfully',
    type: [UserEntity],
  })
  @ApiBadRequestResponse({
    description: 'Invalid login data',
  })
  @ApiConflictResponse({
    description: 'User already exist',
  })
  create(@Body() body: CreateUsersDto) {
    return this.userService.create(body.nickName, body.email, body.password);
  }

  @Post('/login')
  @ApiResponse({
    status: 200,
    description: 'Succesfully logged in',
  })
  @ApiBadRequestResponse({
    description: 'Invalid login data',
  })
   @ApiBody({
      description: 'Data for log in',
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'example@example.com',
          },
          password: {
            type: 'string',
            example: 'password',
          },
        },
      },
    })
  login(@Body() data: { email: string; password: string }) {
    return this.userService.login(data.email, data.password);
  }

  @Delete('/remove')
  @ApiResponse({
    status: 200,
    description: 'User account removed succesfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid user data',
  })
  deleteAccouunt(
    @Body() data: { nickName: string; email: string; password: string },
  ) {
    return this.userService.deleteAccount(
      data.nickName,
      data.email,
      data.password,
    );
  }
}
