import { RestRepository } from './repository/rest.repository';
import { RestService } from './rest.service';
import { Module } from '@nestjs/common';
import { RestResolver } from './rest.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUserAlreadyExistConstraint } from './decorators/alreadyExist.decorator';
import { getFromContainer } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RestRepository])],
  providers: [RestResolver, RestService, IsUserAlreadyExistConstraint],
})
export class RestModule {
  constructor(private repo: RestRepository) {
    const t = getFromContainer(IsUserAlreadyExistConstraint);
    t.setRepository(this.repo);
  }
}
