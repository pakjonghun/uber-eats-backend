import { DishRepo } from './repositories/dishRepo';
import { RestService } from './rest.service';
import { RestResolver, CateResolver, DishResolver } from './rest.resolver';
import { RestRepo } from './repositories/rest.repository';
import { CateRepo } from './repositories/cate.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([CateRepo, RestRepo, DishRepo])],
  providers: [RestResolver, RestService, CateResolver, DishResolver],
})
export class RestModule {}
