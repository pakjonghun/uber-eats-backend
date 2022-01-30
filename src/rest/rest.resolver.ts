import { UpdateRestDto } from './dto/update.dto';
import { RestService } from './rest.service';
import { SecondArgs, ThirdArgs } from './dto/create.dto';
import { RestEntity } from './entities/rest.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RestResolver {
  constructor(private readonly restService: RestService) {}
  @Query(() => Boolean)
  init(): boolean {
    return true;
  }

  @Query(() => [RestEntity])
  test(@Args('id') id: number): Promise<RestEntity[]> {
    return this.restService.test(id);
  }

  @Mutation(() => RestEntity)
  mutation(
    @Args('name') name: string,
    @Args('adress') adress: string,
    @Args('isVagan') isVagan: boolean,
    @Args('taste') taste: string,
  ): Promise<RestEntity> {
    return this.restService.mutation({ name, adress, isVagan, taste });
  }

  @Mutation(() => RestEntity)
  second(@Args('args') args: SecondArgs): Promise<RestEntity> {
    return this.restService.second(args);
  }
  @Mutation(() => RestEntity)
  third(@Args() args: ThirdArgs): Promise<RestEntity> {
    return this.restService.third(args);
  }

  @Mutation(() => Boolean)
  async updateOne(@Args() args: UpdateRestDto): Promise<boolean> {
    return this.restService.update(args);
  }
}
