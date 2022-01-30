import { EntityRepository, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';

@EntityRepository(Users)
export class UserRepo extends Repository<Users> {
  findByEmail(email: string) {
    return this.findOne({ email });
  }
}
