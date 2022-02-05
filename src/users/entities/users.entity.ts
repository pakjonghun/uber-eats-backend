import { Rest } from './../../rest/entities/rest.entity';
import { Core } from '../../core/entities/core.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import * as bcrypt from 'bcrypt';

export enum Role {
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

  @Field(() => [Rest])
  @OneToMany(() => Rest, (rest) => rest.owner)
  rest: Rest[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
