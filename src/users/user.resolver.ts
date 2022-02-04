import { VerifyDto, OutVerify } from './dtos/verify.dto';
import { EmailService } from './../email/email.service';
import { OutUpdate, UpdateDto } from './dtos/update.dto';
import { OutProfile, ProfileDto } from './dtos/profile.dto';
import { AuthGuard, IsMe } from './user.guard';
import { Users } from './entities/users.entity';
import { OutLogin, LoginDto } from './dtos/login.dto';
import { OutRegister, RegisterDto } from './dtos/register.dto';
import { OutFindAll } from './dtos/findAll.dto';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Query(() => [OutFindAll])
  findAll(): Promise<OutFindAll[]> {
    return this.userService.findAll({});
  }

  @UseGuards(AuthGuard)
  @Query(() => Users, { nullable: true })
  me(@User() user: Users): Users {
    return user;
  }

  @UseGuards(AuthGuard)
  @Query(() => OutProfile)
  profile(@Args() args: ProfileDto): Promise<OutProfile> {
    return this.userService.profile(args);
  }

  @Mutation(() => OutRegister)
  register(@Args() args: RegisterDto): Promise<OutRegister> {
    return this.userService.register(args);
  }

  @Mutation(() => OutLogin)
  login(@Args() args: LoginDto): Promise<OutLogin> {
    return this.userService.login(args);
  }

  @Mutation(() => OutUpdate)
  @UseGuards(IsMe)
  @UseGuards(AuthGuard)
  update(@User() me: Users, @Args() args: UpdateDto): Promise<OutUpdate> {
    if (me.email === args.user.email) {
      throw new HttpException(
        {
          status: HttpStatus.FOUND,
          error: 'your main',
        },
        HttpStatus.FOUND,
      );
    }

    return this.userService.update(me, args);
  }

  @Mutation(() => OutVerify)
  verifyEmail(@Args() args: VerifyDto): Promise<OutVerify> {
    return this.userService.verify(args.code);
  }
}
