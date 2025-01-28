import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

const MONGO_URL: string = "mongodb+srv://mnowacki:lr2BXSEPYdUGxp7y@comunicator.on18e.mongodb.net/?retryWrites=true&w=majority&appName=COMUNICATOR"

@Module({
  imports: [MongooseModule.forRoot(MONGO_URL),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
