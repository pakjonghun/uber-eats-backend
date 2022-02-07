import { OutMutation } from './../../core/dtos/mutation.dto';
import { Dish } from './../entities/dish.entity';
import {
  ArgsType,
  Field,
  PartialType,
  PickType,
  Int,
  ObjectType,
  InputType,
} from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
class EditDish extends PartialType(
  PickType(Dish, ['desc', 'img', 'name', 'options', 'price']),
  InputType,
) {}

@ArgsType()
export class EditDishDto {
  @Field(() => EditDish)
  dish: EditDish;

  @Field(() => Int)
  @IsNumber()
  dishId: number;
}

@ObjectType()
export class OutEditDish extends OutMutation {
  @Field(() => Dish, { nullable: true })
  dish: Dish;
}
