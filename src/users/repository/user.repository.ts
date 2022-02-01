import { EntityRepository, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';

@EntityRepository(Users)
export class UserRepo extends Repository<Users> {
  findByEmail(email: string) {
    return this.findOne({ email }, { select: ['password', 'id'] });
  }

  findById(id: number) {
    return this.findOne({ id });
  }

  isExistById(id: number) {
    return !!this.count({ id });
  }
}
