import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
@EntityRepository(OrderEntity)
export class OrderRep extends Repository<OrderEntity> {}
