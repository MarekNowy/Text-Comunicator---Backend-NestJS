 import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  nickName: {type: String, required: true},
  registerAt: {type: Date, required: true},
  updatedAt: {type: Date, required: false},
  password: {type: String, required: true}
});


export interface User {
  
         id: string;
         nickName: string;
         registerAt: Date;
         password: string;
         updatedAt?: Date;
        
        
    
}