import { Pay } from './../entities/pay.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(Pay)
export class PayRepo extends Repository<Pay> {
  async findPays(take: number, skip: number) {
    return this.findAndCount({ take, skip });
  }
}
