import { ApiProperty } from '@nestjs/swagger';
export class ExampleLogin {
  @ApiProperty({
    description: 'Exaple Email',
    type: String,
    example: 'email@example.com',
  })
  email: string;
  @ApiProperty({
    description: 'Your password. Length 4-20 marks',
    type: String,
    example: 'password',
  })
  password: string;
}
