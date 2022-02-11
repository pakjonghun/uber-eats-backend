import { OrderStatus, OrderEntity } from './../entities/order.entity';
import { PagnationDto, OutPagnation } from './../../core/dtos/pagnation.dto';
import { ArgsType, ObjectType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetOrdersDto extends PagnationDto {
  @Field(() => OrderStatus, { nullable: true })
  status?: keyof typeof OrderStatus;
}

@ObjectType()
export class OutGetOrders extends OutPagnation {
  @Field(() => [OrderEntity])
  data: OrderEntity[];
}
