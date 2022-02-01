import { Users } from './../entities/users.entity';
import { OutMutation } from './../../core/dtos/mutation';
import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';

@ObjectType()
class UpdatedUser extends PickType(Users, ['role', 'email']) {}

@ObjectType()
export class OutUpdate extends OutMutation {
  @Field(() => UpdatedUser, { nullable: true })
  UpdatedUser?: UpdatedUser;
}

@InputType()
class UpdateUser extends PartialType(UpdatedUser, InputType) {
  @Field(() => String, { nullable: true })
  @IsString()
  @Length(5, 10)
  @IsOptional()
  password?: string;
}

@ArgsType()
export class UpdateDto {
  @Field(() => Number)
  id: number;

  @Field(() => UpdateUser)
  user: UpdateUser;
}
