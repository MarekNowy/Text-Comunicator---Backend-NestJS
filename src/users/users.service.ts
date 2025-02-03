import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(nickName: string, email: string, password: string) {
    const newUser = new UserEntity();
    newUser.nickName = nickName;
    newUser.email = email;
    newUser.password = password;

    const errors = await validate(newUser);

    newUser.password = await bcrypt.hash(password, 10);

    if (errors.length > 0) {
      throw new Error('validation failed!');
    }

    const emailExist = await this.userRepository.findOne({
      where: [{ email: newUser.email }],
    });
    const nickNameExist = await this.userRepository.findOne({
      where: [{ nickName: newUser.nickName }],
    });

    if (emailExist) {
      throw new Error('Email already exist');
    }
    if (nickNameExist) {
      throw new Error('NickName already exist');
    }

    return this.userRepository.save(newUser);
  }

  async login(loginData: string, password: string) {
    const checkDataValidity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.nickName = :loginData OR user.email = :loginData', {
        loginData,
      })
      .getOne();

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      checkDataValidity?.password,
    );

    if (isPasswordValid) {
      return console.log('login succesful');
    } else {
      throw new Error('Invalid login data');
    }
  }

  async deleteAccount(nickName: string, email: string, password: string) {
    const userToRemove = await this.userRepository
      .createQueryBuilder('user')
      .where('user.nickName = :nickName AND user.email = :email', {
        nickName,
        email,
      })
      .getOne();

    const areSamePasswords: boolean = await bcrypt.compare(
      password,
      userToRemove?.password,
    );

    if (areSamePasswords) {
      const result = await this.userRepository
        .createQueryBuilder()
        .delete()
        .where('nickName = :nickName', { nickName })
        .andWhere('email = :email', { email })
        .execute();

      if (result.affected === 0) {
        return 'problem';
      } else {
        return 'removed';
      }
    }
  }
}
