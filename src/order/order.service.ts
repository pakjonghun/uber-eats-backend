import { Dish } from 'src/rest/entities/dish.entity';
import { DishRepo } from './../rest/repositories/dishRepo';
import { ItemRepo } from './repositories/item.repo';
import { CreateOrderDto, OutCreateOrder } from './dtos/createOrder.dto';
import { RestService } from './../rest/rest.service';
import { OrderRepo } from './repositories/order.repo';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly itemRepo: ItemRepo,
    private readonly restService: RestService,
    private readonly dishRepo: DishRepo,
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
        custom: { id: userId },
        rest,
        total: extra,
        ...(!!orderItems.length && { orderItems }),
      }),
    );

    const data = await this.orderRepo.findOne(
      { id: order.id },
      { relations: ['orderItems', 'custom', 'rest'] },
    );

    return { isSuccess: true, data };
  }
}
