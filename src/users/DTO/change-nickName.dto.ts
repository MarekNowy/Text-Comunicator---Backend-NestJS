import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeNickNameDto {
  @ApiProperty({
    description: 'Nickname, diffrent that prevoius. Lenght 4-14 characters',
    type: String,
    example: 'NewNickName',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(14)
  newNickName: string;
  @ApiProperty({
    description: 'Email related to account whith nickName you want to change',
    type: String,
    example: 'email@example.com',
  })
  @IsEmail()
  email: string;
}
