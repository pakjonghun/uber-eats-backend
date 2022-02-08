import { Rest } from './rest.entity';
import { Core } from './../../core/entities/core.entity';
import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  extra?: number;
}

@InputType('DishOptionsInputType', { isAbstract: true })
@ObjectType()
export class DishOptions {
  @Field(() => String)
  name: string;

  @Field(() => [DishChoice], { nullable: true })
  choices?: DishChoice[];

  @Field(() => Int, { nullable: true })
  extra?: number;
}

@InputType('DishInputTypes', { isAbstract: true })
@Entity()
@ObjectType()
export class Dish extends Core {
  @IsString()
  @Length(1, 10, { message: 'more than 1 length' })
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @IsNumber()
  @Field(() => Int)
  @Column()
  price: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  img?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 10, { message: 'more than 1 length' })
  desc?: string;

  @ManyToOne(() => Rest, (rest) => rest.dish, { onDelete: 'CASCADE' })
  @Field(() => Rest)
  rest: Rest;

  @RelationId((dish: Dish) => dish.rest)
  restId: number;

  @Column({ type: 'json', nullable: true })
  @Field(() => [DishOptions], { nullable: true })
  options?: DishOptions[];
}
