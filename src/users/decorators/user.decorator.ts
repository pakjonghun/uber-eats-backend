import { Users } from './../entities/users.entity';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getManager } from 'typeorm';
import { VerifyOptions } from 'jsonwebtoken';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const context = GqlExecutionContext.create(ctx).getContext();
  return context['user'];
});
