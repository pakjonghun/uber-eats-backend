import { Core } from '../../core/entities/core.entity';
import { ArgsType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import * as bcrypt from 'bcrypt';

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
  @Field(() => Role)
  @IsEnum(Role)
  role: RoleType;

  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(5, 10, { message: 'length 5~10' })
  @Field(() => String)
  password: string;

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
