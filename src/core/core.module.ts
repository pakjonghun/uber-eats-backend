import { PayRepo } from './../pay/repositories/pay.repo';
import { PubSub } from 'graphql-subscriptions';
import { OrderRepo } from './../order/repositories/order.repo';
import { RestRepo } from './../rest/repositories/rest.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagenatigon } from './interfaces/page.interface';
import { CORE_OPTIONS, PUB_SUB } from './core.constants';
import { CoreService } from './core.service';
import { Module, DynamicModule, Global } from '@nestjs/common';

@Global()
@Module({})
export class CoreModule {
  static forRoot(options: Pagenatigon): DynamicModule {
    return {
      module: CoreModule,
      imports: [TypeOrmModule.forFeature([RestRepo, OrderRepo, PayRepo])],
      providers: [
        CoreService,
        { provide: CORE_OPTIONS, useValue: options },
        { provide: PUB_SUB, useValue: new PubSub() },
      ],
      exports: [CoreService, PUB_SUB],
    };
  }
}
