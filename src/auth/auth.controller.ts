import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/publicDecorator';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExampleLogin } from 'src/users/ExampleData/ExampleUserLogin';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'You are logged in successfully',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          example: 'JWT_Token',
        },
        refresh_token: {
          type: 'string',
          example: 'JWT_Token',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Can not find the user' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiBody({ type: ExampleLogin })
  async signIn(@Body() signInDto: Record<string, any>) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }
  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Get new access token' })
  @ApiResponse({
    status: 200,
    description: 'New token created successfully',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          example: 'JWT_Token',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Refresh token is obsolete' })
  @ApiBody({
    schema: {
      properties: {
        refresh_token: {
          type: 'string',
          example: 'jwt_refresh_token',
        },
      },
    },
  })
  async refreshToken(@Body() body: { refresh_token: string }) {
    return this.authService.refreshToken(body.refresh_token);
  }

  @Get('/logout')
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token required to access this route',
    required: true,
  })
  @ApiOperation({ summary: 'Log out and add JWT token to black list' })
  @ApiResponse({
    status: 200,
    description: 'You are logged successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Incorret JWT token' })
  async logOut(@Request() req) {
    const token: string = req.headers['authorization'].split(' ')[1];
    return this.authService.logOut(token);
  }
}
