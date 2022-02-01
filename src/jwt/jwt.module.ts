import { UserRepo } from './../users/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_OPTION } from './interface/jwt.constants';
import { DynamicModule, Module, Global } from '@nestjs/common';
import { JwtModuleOptions } from './interface/jwt.interface';
import { JwtService } from './jwt.service';

@Global()
@Module({})
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [JwtService, { provide: CONFIG_OPTION, useValue: options }],
      exports: [JwtService],
    };
  }
}
