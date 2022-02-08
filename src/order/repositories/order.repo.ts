import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
@EntityRepository(OrderEntity)
export class OrderRepo extends Repository<OrderEntity> {}
