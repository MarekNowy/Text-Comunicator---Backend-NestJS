import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from './messages.entity';
import { UserEntity } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessagesEntity, UserEntity])],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
