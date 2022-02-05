import { RestService } from './rest.service';
import { RestResolver, CateResolver } from './rest.resolver';
import { RestRepo } from './repositories/rest.repository';
import { CateRepo } from './repositories/cate.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([CateRepo, RestRepo])],
  providers: [RestResolver, RestService, CateResolver],
})
export class RestModule {}
