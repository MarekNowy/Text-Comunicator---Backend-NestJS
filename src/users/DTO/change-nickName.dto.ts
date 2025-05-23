import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

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
}
