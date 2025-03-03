import {
  Injectable,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { use } from 'passport';
import { console } from 'inspector';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.login(email, pass);
    const payLoad = { sub: user.id, username: user.nickName };
    return {
      access_token: await this.jwtService.signAsync(payLoad, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
      refresh_token: await this.jwtService.signAsync(payLoad, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    };
  }
  async refreshToken(token: string) {
    console.log(token);
    const payload = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const newPayload = { sub: payload.sub, username: payload.username };
    if (!payload) {
      throw new BadRequestException();
    }
    const newAccessToken = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15s',
    });
    const newRefreshToken = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    return newAccessToken;
  }
}
