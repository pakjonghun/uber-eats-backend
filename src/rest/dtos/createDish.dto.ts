import { OutMutation } from './../../core/dtos/mutation.dto';
import { Dish } from './../entities/dish.entity';
import { ObjectType, PickType, Field, ArgsType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class CreateDishDto extends PickType(
  Dish,
  ['desc', 'img', 'name', 'price', 'options'],
  ArgsType,
) {
  @Field(() => Number)
  restId: number;
}

@ObjectType()
export class OutCreateDish extends OutMutation {
  @IsOptional()
  @Field(() => Dish, { nullable: true })
  data?: Dish;
}
