import { OrderItem } from './../entities/orderItem.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrderItem)
export class ItemRepo extends Repository<OrderItem> {}
