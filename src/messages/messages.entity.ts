import { UUID } from 'crypto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('messages_entity')
@Index(['receiverId', 'senderId'])
export class MessagesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;
  @Column()
  receiverId: UUID;
  @Column()
  senderId: UUID;
  @Column()
  content: string;
  @CreateDateColumn({ type: 'timestamptz' })
  sentAt: Date;
}
