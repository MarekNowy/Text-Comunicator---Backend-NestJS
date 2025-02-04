import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(nickName: string, email: string, password: string) {

    const newUser = this.userRepository.create({
      nickName: nickName,
      email: email,
      password: password
    });

    newUser.password = await bcrypt.hash(password, 10);

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
      checkDataValidity?.password,
    );

    if (isPasswordValid) {
      return 'login succesful';
    } else {
      throw new ForbiddenException("Invalid login data");
    }
  }

  async deleteAccount(nickName: string, email: string, password: string) {
    try {
      const userToRemove = await this.userRepository.findOne({
        where: {
          nickName: nickName,
          email: email,
        },
      });

      const areSamePasswords: boolean = await bcrypt.compare(
        password,
        userToRemove?.password,
      );

      if (areSamePasswords) {
        this.userRepository.delete({ id: userToRemove?.id });
        return 'User removed';
      }
    } catch (error) {
      if (error) throw new UnauthorizedException('Invalid user data');
    }
  }
}
