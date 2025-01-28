import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.model';
import { Model, now } from 'mongoose';


@Injectable()
export class UsersService {
    private users: User[] = [];

    constructor(@InjectModel('User') private readonly userModel: Model<User>){}

    sayHello(){
        return "HEllllo"
    }
    
    async createUser(nickName: string,  password: string  ){
        const users: User[] = [];
        const timeStamp: Date = now();
        const newUser = new this.userModel(
            {nickName: nickName, 
            registerAt: timeStamp, 
            password:password})

         const result = await newUser.save();
 
        console.log(result); 
    }
       

}
