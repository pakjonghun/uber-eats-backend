import { getSlug } from './../../core/utility';
import { Cate } from './../entities/category.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Cate)
export class CateRepo extends Repository<Cate> {
  async createCate(name: string): Promise<Cate> {
    if (!name) return;
    const isExist = await this.checkIsExist(getSlug(name));
    if (isExist) return isExist;
    return this.save(this.create({ name }));
  }

  async checkIsExist(slug: string): Promise<Cate> {
    return this.findOne({ slug });
  }
}
