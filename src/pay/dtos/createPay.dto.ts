import { OutMutation } from './../../core/dtos/mutation.dto';
import { Pay } from './../entities/pay.entity';
import { ArgsType, PickType, ObjectType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class CreatePayDto extends PickType(
  Pay,
  ['restId', 'transactionId'],
  ArgsType,
) {}

@ObjectType()
export class OutCreatePay extends OutMutation {
  @IsOptional()
  @Field(() => Pay, { nullable: true })
  data?: Pay;
}
