import { Controller } from '@nestjs/common';
import { Post,Get,Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTO/create-user-dto';
@Controller('users')
export class UsersController {
 constructor(private readonly userService: UsersService){}

    @Post()
    async createUser(@Body() CreateUserDto: CreateUserDto){
        return this.userService.createUser(CreateUserDto.nickName, CreateUserDto.password)
    }

    @Get()
    sayHello(): string{
        return this.userService.sayHello()
    }


}
