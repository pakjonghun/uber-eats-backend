import { OutLogin, LoginDto } from './dtos/login.dto';
import { OutRegister, RegisterDto } from './dtos/register.dto';
import { OutFindAll } from './dtos/findAll.dto';
import { Users } from './entities/users.entity';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [OutFindAll])
  findAll(): Promise<OutFindAll[]> {
    return this.userService.findAll({});
  }

  @Mutation(() => OutRegister)
  register(@Args() args: RegisterDto): Promise<OutRegister> {
    return this.userService.register(args);
  }

  @Mutation(() => OutLogin)
  login(@Args() args: LoginDto): Promise<OutLogin> {
    return this.userService.login(args);
  }
}
