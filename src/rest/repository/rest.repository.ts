import { RestEntity } from './../entities/rest.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(RestEntity)
export class RestRepository extends Repository<RestEntity> {
  async findByName(name: string) {
    const isExist = this.count({ name });
    console.log(isExist);
    return !!isExist;
  }
}
