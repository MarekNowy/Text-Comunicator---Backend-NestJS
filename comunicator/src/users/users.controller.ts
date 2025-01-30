import { Controller } from '@nestjs/common';
import { Post,Get,Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Console } from 'console';


@Controller('users')
export class UsersController {
 constructor(private readonly userService: UsersService){}

@Post("/register")
create(@Body() body: {nickName:string, email:string, password:string} ){
    return this.userService.create(body.nickName, body.email, body.password)
}

@Get("/login")
login(@Body() data: {loginData: string, password:string}){
    return this.userService.login(data.loginData, data.password)
}

@Delete('/remove')
deleteAccouunt(@Body() data: {nickName:string, email: string, password:string}){
    return this.userService.deleteAccount(data.nickName,data.email,data.password)
}

}
