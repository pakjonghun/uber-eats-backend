import { OutMutation } from './../../core/dtos/mutation';
import { Users } from './../entities/users.entity';
import { ArgsType, PickType, ObjectType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class LoginDto extends PickType(
  Users,
  ['email', 'password'],
  ArgsType,
) {}

@ObjectType()
export class OutLogin extends OutMutation {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  token?: string;
}
