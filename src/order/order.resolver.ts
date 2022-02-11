import { AddDriverDto, OutAddDriverDto } from './dtos/addDriver.dto';
import { PubSub } from 'graphql-subscriptions';
import { OutEditOrder, EditOrderDto } from './dtos/editOrder.dto';
import { OutGetOrders, GetOrdersDto } from './dtos/getOrders.dto';
import { OutGetOrder } from './dtos/getOrder.dto';
import { Role, Users } from './../users/entities/users.entity';
import { OutCreateOrder, CreateOrderDto } from './dtos/createOrder.dto';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';
import {
  Resolver,
  Mutation,
  Args,
  Query,
  Subscription,
  Int,
  Field,
  ArgsType,
} from '@nestjs/graphql';
import { SetRole } from 'src/auth/role.decorator';
import { User } from 'src/users/decorators/user.decorator';
import { Inject } from '@nestjs/common';
import { PUB_SUB, PUB_TRAGGER } from 'src/core/core.constants';

@Resolver(() => OrderEntity)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  @SetRole(['Client'])
  @Mutation(() => OutCreateOrder)
  async createOrder(
    @User() me: Users,
    @Args() args: CreateOrderDto,
  ): Promise<OutCreateOrder> {
    return this.orderService.createOrder(me.id, args);
  }

  @Query(() => OutGetOrder)
  async getOrder(@User() user: Users, id: number): Promise<OutGetOrder> {
    return this.orderService.getOrder(user.id, id);
  }

  @Query(() => OutGetOrders)
  @SetRole(['Any'])
  async getOrders(@User() me: Users, @Args() args: GetOrdersDto) {
    return this.orderService.getOrders(me.id, me.role, args);
  }

  @Mutation(() => OutEditOrder)
  @SetRole(['Any'])
  async editOrder(@User() me: Users, @Args() args: EditOrderDto) {
    return this.orderService.editOrder(me.id, args);
  }

  @Mutation(() => Int)
  async read(@Args('id') id: number) {
    await this.pubsub.publish('hotPotatos', { hotPotatos: id });
    return id;
  }
  // filter?: (payload: any, variables: any, context: any) => boolean | Promise<boolean>;
  // resolve?: (payload: any, args: any, context: any, info: any) => any | Promise<any>;
  @Subscription(() => OrderEntity, {
    filter: (payload, _, ctx) => {
      return ctx['user'].id === payload.pendingOrder.ownerId;
    },
    resolve: ({ pendingOrder: { order } }) => {
      return order;
    },
  })
  @SetRole(['Owner'])
  async pendingOrder() {
    return this.pubsub.asyncIterator(PUB_TRAGGER.PENDING);
  }

  @Subscription(() => OrderEntity, {
    filter: (payload, _, ctx) => {
      return ctx['user'].id === payload.cookingOrder.customerId;
    },
    resolve: ({ cookingOrder }) => {
      return cookingOrder;
    },
  })
  @SetRole(['Client'])
  async cookingOrder() {
    return this.pubsub.asyncIterator(PUB_TRAGGER.COOKING);
  }

  @Subscription(() => OrderEntity)
  @SetRole(['Delevery'])
  async cookedOrder() {
    return this.pubsub.asyncIterator(PUB_TRAGGER.COOKED);
  }

  @Subscription(() => OrderEntity, {
    filter: ({ updateOrder }, { id }, ctx) => {
      const userId = ctx['user'].id;
      console.log(updateOrder.driverId);
      console.log(userId);
      return (
        id === updateOrder.id &&
        (updateOrder.driverId === userId ||
          updateOrder.customerId === userId ||
          updateOrder.rest.ownerId === userId)
      );
    },
  })
  @SetRole(['Any'])
  async updateOrder(@Args('id') id: number) {
    return this.pubsub.asyncIterator(PUB_TRAGGER.UPDATE);
  }

  @Mutation(() => OutAddDriverDto)
  @SetRole(['Delevery'])
  async addDriver(
    @User() me: Users,
    @Args() args: AddDriverDto,
  ): Promise<OutAddDriverDto> {
    return this.orderService.addDriver(me.id, args);
  }
}
