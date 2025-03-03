import { Controller, Get, Request } from '@nestjs/common';
import { Post, Body, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './DTO/create-users.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UserEntity } from './users.entity';
import { ExampleLogin } from './ExampleData/ExampleUserLogin';
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
  @Public()
  @Post('/login')
  @ApiResponse({
    status: 200,
    description: 'Succesfully logged in',
  })
  @ApiBadRequestResponse({
    description: 'Invalid login data',
  })
  @ApiBody({ type: ExampleLogin })
  login(@Body() data: { email: string; password: string }) {
    return this.userService.login(data.email, data.password);
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'User account removed succesfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid user data',
  })
  deleteAccouunt(@Body() data: { email: string; password: string }) {
    return this.userService.deleteAccount(data.email, data.password);
  }

  @Patch()
  @ApiResponse({
    status: 200,
    description: 'User nickname updated succesfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  changeNickName(@Body() data: ChangeNickNameDto) {
    return this.userService.changeNickName(data.newNickName, data.email);
  }

  @Get('/getinfo')
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: UserEntity, 
  })
  @ApiBadRequestResponse({
    description: 'Invalid JWT token',
  })
  getInfo(@Request() req) {
    const UserId: UUID = req.user.sub; 
    return this.userService.getInfo(UserId); 
  }
}
