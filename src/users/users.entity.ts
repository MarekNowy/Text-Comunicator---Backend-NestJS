import { IsOptional } from 'class-validator';
import { UUID } from 'crypto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('user_entity')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;
  @Column()
  nickName: string;
  @Column({ unique: true })
  email: string;
  @Column()
  passwordHash: string;
  @CreateDateColumn({ type: 'timestamptz' })
  registerAt: Date;
}
