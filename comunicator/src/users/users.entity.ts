import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsString, IsEmail, MinLength, IsNotEmpty, MaxLength } from "class-validator";
@Entity("user_entity")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @MinLength(4)
    @MaxLength(12)
    nickName: string;

    @Column()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Column()
    @MinLength(8)
    @MaxLength(40)
    @IsNotEmpty()
    password: string
}