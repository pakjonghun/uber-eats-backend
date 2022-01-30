import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { RestModule } from './rest/rest.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
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
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    RestModule,
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
