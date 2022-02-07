import { Users } from './../../users/entities/users.entity';
import {
  registerEnumType,
  Field,
  ObjectType,
  Float,
  InputType,
} from '@nestjs/graphql';
import { Dish } from './../../rest/entities/dish.entity';
import { Rest } from './../../rest/entities/rest.entity';
import { Core } from './../../core/entities/core.entity';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum OrderStatus {
  'pending' = 'pending',
  'cooking' = 'cooking',
  'delivery' = 'delivery',
  'complish' = 'complish',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@Entity()
@ObjectType()
export class OrderEntity extends Core {
  @ManyToOne(() => Users, (users) => users.customOrders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(() => Users, { nullable: true })
  custom: Users;

  @ManyToOne(() => Users, (users) => users.deliveryOrders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(() => Users, { nullable: true })
  driver?: Users;

  @RelationId((order: OrderEntity) => order.driver)
  driverId: number;

  @ManyToOne(() => Rest, (rest) => rest.order, { onDelete: 'CASCADE' })
  @Field(() => Rest)
  rest: Rest;

  @RelationId((order: OrderEntity) => order.rest)
  restId: number;

  @ManyToMany(() => Dish, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'dish_order',
    joinColumn: { name: 'dish', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'order', referencedColumnName: 'id' },
  })
  @Field(() => [Dish])
  dishes: Dish[];

  @IsNumber()
  @Field(() => Float)
  @Column()
  total: number;

  @IsEnum(OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: 'pending' })
  @Field(() => OrderStatus)
  status: OrderStatus;
}
