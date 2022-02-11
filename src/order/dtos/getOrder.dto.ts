import { OrderEntity } from './../entities/order.entity';
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@ArgsType()
export class GetOrderDto {
  @IsNumber()
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class OutGetOrder extends OrderEntity {}
