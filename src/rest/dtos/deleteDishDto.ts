import { Dish } from './../entities/dish.entity';
import { OutMutation } from './../../core/dtos/mutation.dto';
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class DeleteDishDto {
  @Field(() => Int)
  id: number;
}

@ObjectType()
export class OutDeleteDish extends OutMutation {
  @Field(() => Dish, { nullable: true })
  dish?: Dish;
}
