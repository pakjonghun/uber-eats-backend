import { DishChoice } from './../../rest/entities/dish.entity';
import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { Core } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsOptional } from 'class-validator';
import { Dish } from 'src/rest/entities/dish.entity';

@InputType('DishOptionsInputTypes', { isAbstract: true })
@ObjectType()
export class OrderOption {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  choice?: string;
}

@InputType('orderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends Core {
  @Field(() => Dish)
  @ManyToOne(() => Dish)
  dish: Dish;

  @IsOptional()
  @Field(() => [OrderOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: OrderOption[];
}
