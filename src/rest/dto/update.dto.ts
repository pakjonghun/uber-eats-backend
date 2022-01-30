import { RestEntity } from './../entities/rest.entity';
import {
  ArgsType,
  Field,
  InputType,
  Int,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
class UpdateData extends OmitType(
  PartialType(RestEntity),
  ['id', 'updatedAt', 'createdAt'],
  InputType,
) {}

@ArgsType()
export class UpdateRestDto {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field(() => UpdateData)
  data: UpdateData;
}
