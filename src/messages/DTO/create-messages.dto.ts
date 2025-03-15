import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessagesDto {
  @ApiProperty({
    description: 'Unique receiver ID',
    example: 'cc795339-e833-4d21-844e-7c2f25a962b5',
  })
  @IsUUID()
  receiverId: UUID;
  @ApiProperty({
    description: 'Not empty message content',
    example: 'Here is an example message',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
