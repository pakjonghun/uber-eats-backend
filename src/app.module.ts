import { UserRepo } from './users/repository/user.repository';
import {
  InternalServerErrorException,
  MiddlewareConsumer,
  Module,
  NestModule,
  NotFoundException,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { EmailModule } from './email/email.module';
import { RestModule } from './rest/rest.module';
import { OrderModule } from './order/order.module';
import { PayModule } from './pay/pay.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        TOKEN_SECRET: Joi.string().required(),
        MAIL_KEY: Joi.string().required(),
        MAIL_DOMAIN: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
      }),
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.test',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      debug: false,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (params) => {
            const token = params.authorization;
            if (!token) throw new NotFoundException();

            return { token };
          },
        },
      },
      context: ({ req, res }) => {
        const token = req.cookies.token;
        return { user: req['user'], token, res };
      },
      formatError: (err) => {
        if (
          err.message.startsWith('Database Error') ||
          err.message.startsWith('Field')
        ) {
          console.log(err);
          return new InternalServerErrorException('database error occured');
        } else {
          console.log(err);
          return err;
        }
      },
    }),
    ScheduleModule.forRoot(),
    EmailModule.forRoot({
      EMAI_KEY: process.env.MAIL_KEY,
      MAIL_DOMAIN: process.env.MAIL_DOMAIN,
      MAIL_FROM: process.env.MAIL_FROM,
    }),
    JwtModule.forRoot({ privateKey: process.env.TOKEN_SECRET }),
    TypeOrmModule.forFeature([UserRepo]),
    CoreModule.forRoot({ take: 2 }),
    UsersModule,
    AuthModule,
    RestModule,
    OrderModule,
    PayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
