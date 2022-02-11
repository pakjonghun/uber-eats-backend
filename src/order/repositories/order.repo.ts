import { RestRepo } from './../../rest/repositories/rest.repository';
import { Condition } from './../../core/interfaces/page.interface';
import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
@EntityRepository(OrderEntity)
export class OrderRepo extends Repository<OrderEntity> {
  constructor(private readonly restRepo: RestRepo) {
    super();
  }

  async findPage(take: number, skip: number, condition: Condition) {
    const options = condition.options;

    switch (options.role) {
      case 'Owner':
        return this.findAndCount({
          where: {
            rest: {
              ownerId: options.id,
            },
            ...(options.status && { status: options.status }),
          },
          take,
          skip,
        });

      default:
        const where = { [options.role.toLowerCase()]: { id: options.id } };
        return this.findAndCount({
          where,
          take,
          skip,
          relations: ['orderItems'],
        });
    }
  }
}
