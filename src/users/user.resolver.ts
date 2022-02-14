import { OutCheckEmail, CheckEmailDto } from './dtos/checkEmail.dto';
import { VerifyDto, OutVerify } from './dtos/verify.dto';
import { EmailService } from './../email/email.service';
import { OutUpdate, UpdateDto } from './dtos/update.dto';
import { OutProfile, ProfileDto } from './dtos/profile.dto';
import { Users } from './entities/users.entity';
import { OutLogin, LoginDto } from './dtos/login.dto';
import { OutRegister, RegisterDto } from './dtos/register.dto';
import { OutFindAll } from './dtos/findAll.dto';
import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, Cookie } from './decorators/user.decorator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SetRole } from 'src/auth/role.decorator';
import { Request, Response } from 'express';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @SetRole(['Owner'])
  @Query(() => [OutFindAll])
  findAll(): Promise<OutFindAll[]> {
    return this.userService.findAll({});
  }

  @SetRole(['Any'])
  @Query(() => Users, { nullable: true })
  me(@User() user: Users): Users {
    return user;
  }

  @SetRole(['Any'])
  @Query(() => OutProfile)
  profile(@Args() args: ProfileDto): Promise<OutProfile> {
    return this.userService.profile(args);
  }

  @Mutation(() => OutRegister)
  register(@Args() args: RegisterDto): Promise<OutRegister> {
    return this.userService.register(args);
  }

  @Mutation(() => OutLogin)
  async login(
    @Context() ctx: { req: Request; res: Response },
    @Args() args: LoginDto,
  ): Promise<OutLogin> {
    const result = await this.userService.login(args);
    ctx.res.cookie('token', result.token);
    return result;
  }

  @SetRole(['Any'])
  @Mutation(() => OutUpdate)
  update(@User() me: Users, @Args() args: UpdateDto): Promise<OutUpdate> {
    if (me.email === args.email) {
      throw new HttpException(
        {
          status: HttpStatus.FOUND,
          error: 'your main',
        },
        HttpStatus.FOUND,
      );
    }

    return this.userService.update(me.id, args);
  }

  @Mutation(() => OutVerify)
  verifyEmail(@Args() args: VerifyDto): Promise<OutVerify> {
    return this.userService.verify(args.code);
  }

  @Query(() => OutCheckEmail)
  async checkEmail(@Args() args: CheckEmailDto): Promise<OutCheckEmail> {
    return this.userService.checkEmail(args.email);
  }
}
