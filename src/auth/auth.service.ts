import { UserRepo } from './../users/repository/user.repository';
import { LoginDto } from './../users/dtos/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepo) {}

  async validate({ email, password }: LoginDto): Promise<number> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isPasswordCorrect = await user.checkPassword(password);

    if (!isPasswordCorrect) throw new UnauthorizedException();

    return user.id;
  }
}
