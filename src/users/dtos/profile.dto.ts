import { Users } from './../entities/users.entity';
import { PickType, ObjectType, ArgsType, Field } from '@nestjs/graphql';

@ObjectType()
export class OutProfile extends PickType(
  Users,
  ['email', 'role'],
  ObjectType,
) {}

@ArgsType()
export class ProfileDto {
  @Field(() => Number)
  id: number;
}
