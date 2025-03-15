import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { console } from 'inspector';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.login(email, pass);
    const payLoad = { sub: user.id, username: user.nickName };
    return {
      access_token: await this.jwtService.signAsync(payLoad, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_EXPIRES'),
      }),
      refresh_token: await this.jwtService.signAsync(payLoad, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(`REFRESH_EXPIRES`),
      }),
    };
  }
  async refreshToken(token: string) {
    console.log(token);
    const payload = await this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const newPayload = { sub: payload.sub, username: payload.username };
    if (!payload) {
      throw new BadRequestException();
    }
    const newAccessToken = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: this.configService.get<string>('ACCESS_EXPIRES')
    });
    const newRefreshToken = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: this.configService.get<string>(`REFRESH_EXPIRES`)
    });
    return newAccessToken;
  }
}
