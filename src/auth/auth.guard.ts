import { Users } from './../users/entities/users.entity';
import { JwtService } from './../jwt/jwt.service';
import { UserRepo } from './../users/repository/user.repository';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Roles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const role = this.reflector.get<Roles[]>('roles', context.getHandler());
    const ctx = GqlExecutionContext.create(context).getContext();

    let user: null | Users;
    if (ctx.token) {
      const payload = this.jwtService.verify(ctx.token);
      if (typeof payload === 'object' && 'id' in payload) {
        user = await this.userRepo.findOne({ id: payload.id });
        if (user) ctx['user'] = user;
      }
    }

    if (ctx['user']) user = ctx['user'];

    switch (true) {
      case !role:
        return true;
      case role[0] === 'Any':
        return !!user;
      default:
        return role.includes(user['role']);
    }
  }
}
