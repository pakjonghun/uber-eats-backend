import { Verify } from './verify.entity';
import { Core } from '../../core/entities/core.entity';
import { ArgsType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { IsEmailExist } from 'src/auth/validate.decorator';

enum Role {
  'Delevery' = 'Delevery',
  'Client' = 'Client',
  'Owner' = 'Owner',
}
type RoleType = keyof typeof Role;
registerEnumType(Role, { name: 'Role' });

@Entity()
@ObjectType()
export class Users extends Core {
  @Column({ type: 'enum', enum: Role, default: 'Client' })
  @Field(() => Role, { defaultValue: 'Client' })
  @IsEnum(Role)
  role: RoleType;

  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsString()
  @Length(5, 10, { message: 'length 5~10' })
  @Field(() => String)
  password: string;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { defaultValue: false })
  isEmailVerified?: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    console.log(this.password);
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
