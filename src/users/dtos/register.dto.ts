import { OutMutation } from './../../core/dtos/mutation';
import { Users } from './../entities/users.entity';
import { ArgsType, Field, ObjectType, OmitType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { IsEmailExist } from 'src/auth/validate.decorator';

@ArgsType()
export class RegisterDto extends OmitType(
  Users,
  ['createdAt', 'updatedAt', 'id', 'email'],
  ArgsType,
) {
  @Field(() => String)
  @IsEmail()
  @IsEmailExist('Register', { message: 'email used' })
  email: string;
}

@ObjectType()
class User extends OmitType(Users, ['createdAt', 'updatedAt', 'password']) {}

@ObjectType()
export class OutRegister extends OutMutation {
  @Field(() => User)
  user: User;
}
