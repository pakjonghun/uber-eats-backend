import { Verify } from './../entities/verify.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Verify)
export class VerifyRepo extends Repository<Verify> {
  findByCode(code: string) {
    return this.findOne({ code }, { relations: ['user'] });
  }

  findByUserId(id: number) {
    return this.findOne({ user: { id } }, { relations: ['user'] });
  }

  async createVerify(userId: number) {
    const verify = this.create({ user: { id: userId } });
    const v = await this.save(verify);
    return v.code;
  }
}
