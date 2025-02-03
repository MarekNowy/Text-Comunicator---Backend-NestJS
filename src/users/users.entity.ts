import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_entity')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nickName: string;
  @Column()
  email: string;
  @Column()
  password: string;
}
