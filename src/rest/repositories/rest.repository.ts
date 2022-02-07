import { SearchOptions } from './../../core/interfaces/page.interface';
import { Rest } from './../entities/rest.entity';
import { EntityRepository, Repository, ILike } from 'typeorm';

@EntityRepository(Rest)
export class RestRepo extends Repository<Rest> {
  async findByNamePage(take: number, skip: number, { name }: SearchOptions) {
    return this.findAndCount({
      where: { name: ILike(`%${name}%`) },
      take,
      skip,
    });
  }

  async findPage(take: number, skip: number) {
    return this.findAndCount({
      take,
      skip,
      relations: ['cate'],
    });
  }
}
