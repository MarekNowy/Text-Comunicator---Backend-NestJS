import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateMessagesDto {
  @IsUUID()
  receiverId: UUID;
  @IsUUID()
  senderId: UUID;
  @IsNotEmpty()
  @IsString()
  content: string;
}
