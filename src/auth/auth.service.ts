import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface BlackToken {
  token: string;
  expireIn: number;
}
const blackList: BlackToken[] = [];

const removeObsoleteToken = () => {
  const miliseconds = Date.now();
  const seconds = Math.floor(miliseconds / 1000);
  for (let i = 0; i < blackList.length; i++) {
    if (blackList[i].expireIn <= seconds) {
      blackList.splice(i, 1);
    }
  }
};

export const isTokenBlackListed = (token: string) => {
  return blackList.some((blackToken) => blackToken.token === token);
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
      expiresIn: this.configService.get<string>('ACCESS_EXPIRES'),
    });
    const newRefreshToken = await this.jwtService.signAsync(newPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: this.configService.get<string>(`REFRESH_EXPIRES`),
    });
    return newAccessToken;
  }

  async logOut(token: string) {
    removeObsoleteToken();
    const decoded = await this.jwtService.decode(token);
    const expireIn = decoded['exp'];
    const blackToken: BlackToken = {
      token: token,
      expireIn: expireIn,
    };
    blackList.push(blackToken);
  }
}
