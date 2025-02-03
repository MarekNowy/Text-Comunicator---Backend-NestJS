import { IsString, IsInt, IsNotEmpty, IsDate } from 'class-validator';

export class CreateMessagesDto {
  @IsInt()
  receiverId: number;
  @IsInt()
  senderId: number;
  @IsNotEmpty()
  @IsString()
  content: string;
}
