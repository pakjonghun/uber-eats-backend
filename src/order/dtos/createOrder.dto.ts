import { DishOptions, DishChoice } from './../../rest/entities/dish.entity';
import { OutMutation } from './../../core/dtos/mutation.dto';
import { OrderEntity } from './../entities/order.entity';
import { ArgsType, Field, Int, ObjectType, InputType } from '@nestjs/graphql';
import { IsArray, IsOptional, IsNumber } from 'class-validator';
import { OrderOption } from '../entities/orderItem.entity';

@InputType()
class DishInput {
  @Field(() => Int)
  dishId: number;

  @Field(() => OrderOption, { nullable: true })
  options?: OrderOption;
}

@ArgsType()
export class CreateOrderDto {
  @IsNumber()
  @Field(() => Int)
  restId: number;

  @IsOptional()
  @IsArray()
  @Field(() => [DishInput], { nullable: true })
  dishs?: DishInput[];
}

@ObjectType()
export class OutCreateOrder extends OutMutation {
  @IsOptional()
  @Field(() => OrderEntity, { nullable: true })
  data?: OrderEntity;
}
