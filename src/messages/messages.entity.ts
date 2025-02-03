import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('messages_entity')
export class MessagesEntity {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column()
  receiverId: number;
  @Column()
  senderId: number;
  @Column()
  content: string;
  @Column()
  sentAt: Date;
}
