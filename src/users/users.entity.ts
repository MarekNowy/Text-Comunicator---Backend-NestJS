import { UUID } from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_entity')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;
  @Column()
  nickName: string;
  @Column()
  email: string;
  @Column()
  password: string;
}
