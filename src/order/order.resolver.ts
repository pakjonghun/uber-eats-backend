import { Users } from './../users/entities/users.entity';
import { OutCreateOrder, CreateOrderDto } from './dtos/createOrder.dto';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SetRole } from 'src/auth/role.decorator';
import { User } from 'src/users/decorators/user.decorator';

@Resolver(() => OrderEntity)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @SetRole(['Client'])
  @Mutation(() => OutCreateOrder)
  async createOrder(
    @User() me: Users,
    @Args() args: CreateOrderDto,
  ): Promise<OutCreateOrder> {
    return this.orderService.createOrder(me.id, args);
  }
}
