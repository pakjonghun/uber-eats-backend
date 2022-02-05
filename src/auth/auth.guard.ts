import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Roles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<Roles[]>('roles', context.getHandler());
    const ctx = GqlExecutionContext.create(context).getContext();
    const user = ctx['user'];
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
