import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const context = GqlExecutionContext.create(ctx).getContext();
  return context['user'];
});

export const Cookie = createParamDecorator(
  (name: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return name ? req.cookies?.[name] : req.cookies;
  },
);
