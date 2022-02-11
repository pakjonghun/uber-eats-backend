import { OrderEntity } from './../entities/order.entity';
import { OutMutation } from './../../core/dtos/mutation.dto';
import { ArgsType, Field, ObjectType, PickType } from '@nestjs/graphql';

@ArgsType()
export class EditOrderDto extends PickType(
  OrderEntity,
  ['status', 'id'],
  ArgsType,
) {}

@ObjectType()
export class OutEditOrder extends OutMutation {
  @Field(() => OrderEntity)
  data: OrderEntity;
}
