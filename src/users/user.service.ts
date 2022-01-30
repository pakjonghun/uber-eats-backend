import { UserRepo } from './repository/user.repository';
import { AuthService } from './../auth/auth.service';
import { LoginDto, OutLogin } from './dtos/login.dto';
import { OutRegister, RegisterDto } from './dtos/register.dto';
import { FindAllDto } from './dtos/findAll.dto';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Users } from './entities/users.entity';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly UserRepo: UserRepo,
    private readonly jwtService: JwtService,
  ) {}

  private readonly take = 10;
  async findAll(args: FindAllDto) {
    const [results, total] = await this.UserRepo.findAndCount({
      take: (args.page - 1) * this.take,
    });

    return results;
  }

  async register(args: RegisterDto): Promise<OutRegister> {
    //커스텀 데코레이터로 빼야 함
    const user = await this.UserRepo.findOne({ email: args.email });
    if (user)
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'used email',
        },
        HttpStatus.CONFLICT,
      );

    const newUser = await this.UserRepo.save(this.UserRepo.create(args));
    return { isSuccess: true, user: newUser };
  }

  async login(args: LoginDto): Promise<OutLogin> {
    const id = await this.authService.validate(args);
    const token = this.jwtService.sign(id);
    return { isSuccess: true, token };
  }
}
