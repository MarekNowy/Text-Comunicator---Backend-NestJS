import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/users.entity';
import { MessagesModule } from './messages/messages.module';
import { MessagesEntity } from './messages/messages.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat-gateway';
import { UsersService } from './users/users.service';
import { MessagesService } from './messages/messages.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'Users',
      entities: [UserEntity, MessagesEntity],
      synchronize: true,
    }),
    UsersModule,
    MessagesModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
