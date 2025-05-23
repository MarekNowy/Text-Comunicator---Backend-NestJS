import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { MessagesEntity } from 'src/messages/messages.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MessagesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15s' },
    }),
    TypeOrmModule.forFeature([UserEntity, MessagesEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersService,
    JwtService,
  ],
})
export class AuthModule {}
