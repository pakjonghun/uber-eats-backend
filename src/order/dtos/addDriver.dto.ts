import { OutMutation } from './../../core/dtos/mutation.dto';
import { OrderEntity } from './../entities/order.entity';
import { ArgsType, ObjectType, PickType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class AddDriverDto extends PickType(OrderEntity, ['id'], ArgsType) {}

@ObjectType()
export class OutAddDriverDto extends OutMutation {
  @IsOptional()
  @Field(() => OrderEntity, { nullable: true })
  data?: OrderEntity;
}
