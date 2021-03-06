import { Users } from './../entities/users.entity';
import { OutMutation } from '../../core/dtos/mutation.dto';
import {
  Field,
  ObjectType,
  PickType,
  PartialType,
  ArgsType,
} from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ObjectType()
class UpdatedUser extends PickType(Users, ['role', 'email']) {}

@ObjectType()
export class OutUpdate extends OutMutation {
  @Field(() => UpdatedUser, { nullable: true })
  UpdatedUser?: UpdatedUser;
}

@ArgsType()
export class UpdateDto extends PartialType(
  PickType(Users, ['email', 'role']),
  ArgsType,
) {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  password?: string;
}
