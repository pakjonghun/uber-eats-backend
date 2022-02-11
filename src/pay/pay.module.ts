import { RestRepo } from './../rest/repositories/rest.repository';
import { PayResolve } from './pay.resolver';
import { PayService } from './pay.service';
import { PayRepo } from './repositories/pay.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([PayRepo, RestRepo])],
  exports: [PayService],
  providers: [PayResolve, PayService],
})
export class PayModule {}
