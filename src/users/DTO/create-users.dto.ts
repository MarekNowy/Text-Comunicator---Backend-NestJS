import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @MinLength(4)
  @MaxLength(14)
  nickName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
