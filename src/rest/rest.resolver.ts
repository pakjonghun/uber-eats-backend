import { Cate } from './entities/category.entity';
import { FindAllCate } from './dtos/catefind.dto';
import { RestService } from './rest.service';
import { Users } from './../users/entities/users.entity';
import { User } from './../users/decorators/user.decorator';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Int,
} from '@nestjs/graphql';
import { OutRegisterRest, RegisterRestDto } from './dtos/register.dto';
import { SetRole } from 'src/auth/role.decorator';
import { OutRestUpdate, UpdateRestDto } from './dtos/update.dto';
import { DeleteDto, OutDelete } from './dtos/delete.dto';

@Resolver()
export class RestResolver {
  constructor(private readonly restService: RestService) {}

  @SetRole(['Owner'])
  @Mutation(() => OutRegisterRest)
  createRest(
    @User() user: Users,
    @Args('args') args: RegisterRestDto,
  ): Promise<OutRegisterRest> {
    return this.restService.createRest(user.id, args);
  }

  @SetRole(['Owner'])
  @Mutation(() => OutRestUpdate)
  updateRest(
    @User() me: Users,
    @Args() args: UpdateRestDto,
  ): Promise<OutRestUpdate> {
    return this.restService.updateRest(me.id, args);
  }

  @SetRole(['Owner'])
  @Mutation(() => OutDelete)
  async deleteRest(
    @User() me: Users,
    @Args() args: DeleteDto,
  ): Promise<OutDelete> {
    return this.restService.deleteRest(me.id, args.id);
  }
}

@Resolver(() => Cate)
export class CateResolver {
  constructor(private readonly restService: RestService) {}

  @ResolveField(() => Int)
  async restaurantCount(): Promise<number> {
    return this.restService.countRest();
  }

  @Query(() => FindAllCate)
  findAllCate(): Promise<FindAllCate> {
    return this.restService.findAllCate();
  }
}
