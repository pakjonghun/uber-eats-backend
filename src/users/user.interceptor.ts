// import { GqlExecutionContext } from '@nestjs/graphql';
// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class CookieInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> {
//     const ctx = GqlExecutionContext.create(context).getContext();
//     const res = ctx.response;
//     return next.handle().pipe(tap((data) =>res.setCookie('token',)));
//   }
// }
