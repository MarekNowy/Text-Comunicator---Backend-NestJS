import { Controller } from '@nestjs/common';
import { Post,Get,Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Console } from 'console';
@Controller('users')
export class UsersController {
 constructor(private readonly userService: UsersService){}

   

}
