import { OutDeleteDish } from './dtos/deleteDishDto';
import { OutEditDish, EditDishDto } from './dtos/editDish.dto';
import { Dish } from './entities/dish.entity';
import { OutCreateDish, CreateDishDto } from './dtos/createDish.dto';
import { FindRestByIdDto } from './dtos/findRestById.dto';
import { OutRestSestch, RestSearchDto } from './dtos/searchRest.dto';
import { FindRestDto, OutFindRestDto } from './dtos/findRests.dto';
import { Rest } from './entities/rest.entity';
import { Cate } from './entities/category.entity';
import { FindAllCate, FindAllCateDto } from './dtos/catefind.dto';
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
  Parent,
} from '@nestjs/graphql';
import { OutRegisterRest, RegisterRestDto } from './dtos/register.dto';
import { SetRole } from 'src/auth/role.decorator';
import { OutRestUpdate, UpdateRestDto } from './dtos/update.dto';
import { DeleteDto, OutDelete } from './dtos/delete.dto';
import { FindOneCateDto, OutFindOneCate } from './dtos/cateFindOne.dto';

@Resolver(() => Rest)
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

  @ResolveField(() => String)
  async ownerName(@Parent() rest: Rest): Promise<string> {
    return this.restService.getOwnerName(rest.ownerId);
  }

  @Query(() => OutFindRestDto)
  async findRests(@Args() args: FindRestDto): Promise<OutFindRestDto> {
    return this.restService.findRests(args);
  }

  @Query(() => OutRestSestch)
  async searchRest(@Args() args: RestSearchDto): Promise<OutRestSestch> {
    return this.restService.SearchRest(args);
  }

  @Query(() => Rest)
  async findRestById(@Args() args: FindRestByIdDto): Promise<Rest> {
    return this.restService.findRestById(args.id);
  }
}

@Resolver(() => Cate)
export class CateResolver {
  constructor(private readonly restService: RestService) {}

  @ResolveField(() => Int)
  async restaurantCount(@Parent() cate: Cate): Promise<number> {
    return this.restService.countRest(cate.id);
  }

  @Query(() => FindAllCate)
  findAllCate(@Args() args: FindAllCateDto): Promise<FindAllCate> {
    return this.restService.findAllCate(args);
  }

  @Query(() => OutFindOneCate)
  findOneCate(@Args() args: FindOneCateDto): Promise<OutFindOneCate> {
    return this.restService.findCateBySlug(args);
  }
}

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly restService: RestService) {}
  @SetRole(['Owner'])
  @Mutation(() => OutCreateDish)
  createDish(
    @User() me: Users,
    @Args() args: CreateDishDto,
  ): Promise<OutCreateDish> {
    return this.restService.CreateDish(me.id, args);
  }

  @SetRole(['Owner'])
  @Mutation(() => OutEditDish)
  async editDish(
    @User() me: Users,
    @Args() args: EditDishDto,
  ): Promise<OutEditDish> {
    return this.restService.editDish(me.id, args);
  }

  @SetRole(['Owner'])
  @Mutation(() => OutDeleteDish)
  async deleteDish(@User() me: Users, @Args() args: DeleteDto) {
    return this.restService.deleteDish(me.id, args.id);
  }
}
