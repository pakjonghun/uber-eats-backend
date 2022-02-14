import { OutMutation } from './../../core/dtos/mutation.dto';
import { Users } from './../entities/users.entity';
import { ArgsType, ObjectType, PickType } from '@nestjs/graphql';
@ArgsType()
export class CheckEmailDto extends PickType(Users, ['email'], ArgsType) {}

@ObjectType()
export class OutCheckEmail extends OutMutation {}
