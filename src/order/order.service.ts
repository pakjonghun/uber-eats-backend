import { AddDriverDto, OutAddDriverDto } from './dtos/addDriver.dto';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB, PUB_TRAGGER } from './../core/core.constants';
import { EditOrderDto, OutEditOrder } from './dtos/editOrder.dto';
import { Roles } from './../auth/role.decorator';
import { CoreService } from './../core/core.service';
import { OutGetOrder } from './dtos/getOrder.dto';
import { ItemRepo } from './repositories/item.repo';
import { CreateOrderDto, OutCreateOrder } from './dtos/createOrder.dto';
import { RestService } from './../rest/rest.service';
import { OrderRepo } from './repositories/order.repo';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OutGetOrders, GetOrdersDto } from './dtos/getOrders.dto';
import { Users } from 'src/users/entities/users.entity';
import { exist } from 'joi';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly itemRepo: ItemRepo,
    private readonly restService: RestService,
    private readonly coreService: CoreService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async createOrder(userId, args: CreateOrderDto): Promise<OutCreateOrder> {
    const rest = await this.restService.findRestById(args.restId);
    if (!rest) throw new NotFoundException();
    const orderItems = [];
    let extra = 0;

    for (const dish of rest.dish) {
      const d = args.dishs.find((item) => item.dishId === dish.id);
      if (!d) continue;
      extra += dish.price;
      if (d.options) {
        const o = dish.options.find((i) => i.name === d.options.name);
        if (!o) throw new NotFoundException('wrong option');
        extra += o.extra || 0;
        if (d.options.choice) {
          const c = o.choices.find((c) => c.name === d.options.choice);
          if (!c) throw new NotFoundException('wrong choice');
          extra += c.extra;
        }
      }

      orderItems.push(
        await this.itemRepo.save(
          this.itemRepo.create({ dish, options: [d.options] }),
        ),
      );
    }
    const order = await this.orderRepo.save(
      this.orderRepo.create({
        client: { id: userId },
        rest,
        total: extra,
        ...(!!orderItems.length && { orderItems }),
      }),
    );

    const data = await this.orderRepo.findOne(
      { id: order.id },
      { relations: ['orderItems', 'client', 'rest'] },
    );

    await this.pubSub.publish(PUB_TRAGGER.PENDING, {
      pendingOrder: { order: data, ownerId: rest.ownerId },
    });

    return { isSuccess: true, data };
  }

  async getOrder(userId: number, id: number): Promise<OutGetOrder> {
    const r = await this.orderRepo.findOne({ id });

    if (!r) throw new NotFoundException();

    if (r.customerId !== userId && r.driverId !== userId && r.restId !== userId)
      throw new UnauthorizedException();

    return r;
  }

  async getOrders(
    userId: number,
    role: Roles,
    args: GetOrdersDto,
  ): Promise<OutGetOrders> {
    return this.coreService.getData(args.page, 'orderRepo', {
      orderRepo: 'findPage',
      options: { id: userId, role },
    });
  }

  async editOrder(userId: number, args: EditOrderDto): Promise<OutEditOrder> {
    const isExist = await this.orderRepo.findOne({ id: args.id });
    if (!isExist) throw new NotFoundException();

    if (isExist.customerId === userId) throw new UnauthorizedException();

    if (isExist.driverId !== userId && isExist.rest.ownerId !== userId) {
      throw new UnauthorizedException();
    }

    const curStatus = isExist.status;
    if (isExist.driverId === userId) {
      if (curStatus === 'cooked' && args.status !== 'delivery') {
        throw new BadRequestException();
      }

      if (curStatus === 'delivery' && args.status !== 'complish') {
        throw new BadRequestException();
      }
    }

    if (isExist.rest.ownerId === userId) {
      if (curStatus === 'pending' && args.status !== 'cooking') {
        throw new BadRequestException();
      }

      if (curStatus === 'cooking' && args.status !== 'cooked') {
        throw new BadRequestException();
      }
    }
    await this.orderRepo.save(args);

    if (args.status === 'cooked') {
      await this.pubSub.publish(PUB_TRAGGER.COOKED, {
        cookedOrder: { ...isExist, status: args.status },
      });
    }

    if (args.status === 'complish' || args.status === 'cooking') {
      await this.pubSub.publish(PUB_TRAGGER.UPDATE, {
        updateOrder: { ...isExist, status: args.status },
      });
    }

    return { isSuccess: true, data: { ...isExist, status: args.status } };
  }

  async addDriver(
    userId: number,
    args: AddDriverDto,
  ): Promise<OutAddDriverDto> {
    const isExist = await this.orderRepo.findOne(args.id);
    if (!isExist) throw new NotFoundException('order is not exist');
    if (isExist.driverId) throw new BadRequestException('already exist driver');

    await this.orderRepo.save([{ ...args, driver: { id: userId } }]);

    await this.pubSub.publish(PUB_TRAGGER.UPDATE, {
      updateOrder: { ...isExist, driverId: userId },
    });
    return { isSuccess: true, data: isExist };
  }
}
