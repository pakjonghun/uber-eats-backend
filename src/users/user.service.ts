import { VerifyRepo } from './repository/verify.repository';
import { UpdateDto, OutUpdate } from './dtos/update.dto';
import { ProfileDto, OutProfile } from './dtos/profile.dto';
import { UserRepo } from './repository/user.repository';
import { AuthService } from './../auth/auth.service';
import { LoginDto, OutLogin } from './dtos/login.dto';
import { OutRegister, RegisterDto } from './dtos/register.dto';
import { FindAllDto } from './dtos/findAll.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { OutVerify } from './dtos/verify.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
    private readonly verifyRepo: VerifyRepo,
  ) {}

  private readonly take = 10;
  async findAll(args: FindAllDto) {
    const [results, total] = await this.userRepo.findAndCount({
      take: (args.page - 1) * this.take,
    });

    return results;
  }

  async register(args: RegisterDto): Promise<OutRegister> {
    const user = await this.userRepo.save(this.userRepo.create(args));
    await this.createVerify(user.id);
    return { isSuccess: true, user };
  }

  async login(args: LoginDto): Promise<OutLogin> {
    const id = await this.authService.validate(args);
    const token = this.jwtService.sign(id);
    return { isSuccess: true, token };
  }

  async profile(args: ProfileDto): Promise<OutProfile> {
    const user = await this.userRepo.findById(args.id);
    if (!user) throw new NotFoundException();
    const { role, email } = user;
    return { role, email };
  }

  async update({ id, user }: UpdateDto): Promise<OutUpdate> {
    if (!(await this.userRepo.isExistById(id))) throw new NotFoundException();
    if (user.email && (await this.userRepo.findByEmail(user.email))) {
      throw new ForbiddenException();
    }

    const userObj = this.userRepo.create({ id, ...user });
    console.log(userObj);
    if (user.email) {
      await this.deleteVerify(userObj.id);
      await this.createVerify(userObj.id);
    }

    const { role, email } = await this.userRepo.save(userObj);
    return { isSuccess: true, UpdatedUser: { role, email } };
  }

  async verify(code: string): Promise<OutVerify> {
    const verify = await this.verifyRepo.findByCode(code);
    if (!verify) throw new NotFoundException();
    verify.user.isEmailVerified = true;
    await this.userRepo.save(verify.user);
    await this.verifyRepo.delete({ id: verify.id });
    return { isSuccess: true };
  }

  async deleteVerify(userId: number) {
    const isExist = await this.verifyRepo.findByUserId(userId);
    if (!isExist) return;
    await this.verifyRepo.delete({ id: isExist.id });
  }

  async createVerify(userId: number) {
    const verify = this.verifyRepo.create({ user: { id: userId } });
    await this.verifyRepo.save(verify);
  }
}
