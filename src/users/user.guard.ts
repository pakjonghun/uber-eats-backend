import { GqlExecutionContext } from '@nestjs/graphql';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    console.log('auth', ctx['user']);
    return !!ctx['user'];
  }
}

@Injectable()
export class IsMe implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { id } = GqlExecutionContext.create(context).getArgs();
    console.log('isme', ctx['user'].id);
    return ctx['user'].id === id;
  }
}
