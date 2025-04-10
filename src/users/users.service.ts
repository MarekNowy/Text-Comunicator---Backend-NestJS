import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';
import { MessagesEntity } from 'src/messages/messages.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(MessagesEntity)
    private messagesRepository: Repository<MessagesEntity>,
  ) {}

  async getInfo(UserId: UUID) {
    return this.userRepository.findOne({
      where: {
        id: UserId,
      },
    });
  }

  async create(nickName: string, email: string, password: string) {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      nickName: nickName,
      email: email,
      passwordHash: hashedPassword,
    });

    const emailExist = await this.userRepository.findOne({
      where: [{ email: newUser.email }],
    });
    if (emailExist) {
      throw new ConflictException('Email already exist');
    }
    return this.userRepository.save(newUser);
  }

  async login(email: string, password: string) {
    const userToSignIn = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!userToSignIn) {
      throw new NotFoundException();
    }
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      userToSignIn?.passwordHash,
    );
    if (isPasswordValid) {
      return userToSignIn;
    } else {
      throw new UnauthorizedException('Invalid login data');
    }
  }

  async deleteAccount(userId: UUID, email: string, password: string) {
    const userToRemove = await this.userRepository.findOne({
      where: {
        id: userId,
        email: email,
      },
    });

    if (!userToRemove) {
      throw new NotFoundException();
    }
    const areSamePasswords: boolean = await bcrypt.compare(
      password,
      userToRemove?.passwordHash,
    );

    if (!areSamePasswords) {
      throw new ForbiddenException();
    }

    try {
      await this.messagesRepository
        .createQueryBuilder()
        .delete()
        .from(MessagesEntity)
        .where('senderId = :userId OR receiverId = :userId', { userId })
        .execute();
      await this.userRepository.delete({ id: userToRemove?.id });
    } catch (e) {
      console.log(e);
    }
  }

  async changeNickName(newNickName: string, userId: UUID) {
    const userToUpdate = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!userToUpdate) {
      throw new NotFoundException();
    }
    if (userToUpdate.nickName === newNickName) {
      throw new ConflictException();
    }
    return await this.userRepository.update(userToUpdate.id, {
      nickName: newNickName,
    });
  }
  async showUsers(nickName: string) {
    if (nickName) {
      const users = await this.userRepository.find({
        where: {
          nickName: Like(`${nickName}%`),
        },
        select: ['id', 'nickName', 'email'],
      });
      return users;
    }
  }
  async showStats(myId: UUID) {
    const user = await this.userRepository.findOne({
      where: {
        id: myId,
      },
    });
    const howManyMessages = await this.messagesRepository.count({
      where: {
        senderId: myId,
      },
    });
    return {
      id: user?.id,
      email: user?.email,
      nickName: user?.nickName,
      howManyMessages: howManyMessages,
      registerAt: user?.registerAt,
    };
  }
}
