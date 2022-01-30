import { OutMutation } from './../../core/dtos/mutation';
import { Users } from './../entities/users.entity';
import { ArgsType, Field, ObjectType, OmitType } from '@nestjs/graphql';

@ArgsType()
export class RegisterDto extends OmitType(
  Users,
  ['createdAt', 'updatedAt', 'id'],
  ArgsType,
) {}

@ObjectType()
class User extends OmitType(Users, ['createdAt', 'updatedAt', 'password']) {}

@ObjectType()
export class OutRegister extends OutMutation {
  @Field(() => User)
  user: User;
}
