import { RestRepo } from './../rest/repositories/rest.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagenatigon } from './interfaces/page.interface';
import { CORE_OPTIONS } from './core.constants';
import { CoreService } from './core.service';
import { Module, DynamicModule, Global } from '@nestjs/common';

@Global()
@Module({})
export class CoreModule {
  static forRoot(options: Pagenatigon): DynamicModule {
    return {
      module: CoreModule,
      imports: [TypeOrmModule.forFeature([RestRepo])],
      providers: [CoreService, { provide: CORE_OPTIONS, useValue: options }],
      exports: [CoreService],
    };
  }
}
