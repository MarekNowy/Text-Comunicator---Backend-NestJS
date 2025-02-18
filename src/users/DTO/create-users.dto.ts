import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({
    description: 'Your nickname. Length 4-14 marks',
    example: 'Maro1388',
    type: String,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(14)
  nickName: string;
  @ApiProperty({
    description: 'Your email',
    example: 'example@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Your password. Length 4-20 marks',
    type: String,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
