import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangeNickNameDto } from './DTO/change-nickName.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(nickName: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      nickName: nickName,
      email: email,
      passwordHash: hashedPassword
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
    const checkDataValidity = await this.userRepository.findOne({
      where: [{ email: email }],
    });

      const isPasswordValid: boolean = await bcrypt.compare(
      password,
      checkDataValidity?.passwordHash,
    );

    if (isPasswordValid) {
      return 'login succesful';
    } else {
      throw new ForbiddenException('Invalid login data');
    }
  }

  async deleteAccount(email: string, password: string) {
    const userToRemove = await this.userRepository.findOne({
      where: {
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
      throw new BadRequestException();
    }
    await this.userRepository.delete({ id: userToRemove?.id });
  }

  async changeNickName(newNickName: string, email: string) {
    const userToUpdate = await this.userRepository.findOne({
      where: {
        email: email,
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
}
