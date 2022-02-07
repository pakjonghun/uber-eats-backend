import { EditDishDto, OutEditDish } from './dtos/editDish.dto';
import { DishRepo } from './repositories/dishRepo';
import { CreateDishDto, OutCreateDish } from './dtos/createDish.dto';
import { CoreService } from './../core/core.service';
import { Rest } from './entities/rest.entity';
import { RestSearchDto, OutRestSestch } from './dtos/searchRest.dto';
import { FindRestDto, OutFindRestDto } from './dtos/findRests.dto';
import { FindOneCateDto, OutFindOneCate } from './dtos/cateFindOne.dto';
import { OutRestUpdate, UpdateRestDto } from './dtos/update.dto';
import { Cate } from './entities/category.entity';
import { CateRepo } from './repositories/cate.repository';
import { RestRepo } from './repositories/rest.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OutRegisterRest, RegisterRestDto } from './dtos/register.dto';
import { OutDelete } from './dtos/delete.dto';
import { FindAllCate, FindAllCateDto } from './dtos/catefind.dto';
import { OutDeleteDish } from './dtos/deleteDishDto';

@Injectable()
export class RestService {
  constructor(
    private readonly restRepo: RestRepo,
    private readonly cateRepo: CateRepo,
    private readonly dishRepo: DishRepo,
    private readonly coreService: CoreService,
  ) {}

  async createRest(
    userId: number,
    args: RegisterRestDto,
  ): Promise<OutRegisterRest> {
    let cate: Cate | null;
    if (args.cateName) {
      cate = await this.cateRepo.createCate(args.cateName);
    }

    const rest = await this.restRepo.save(
      this.restRepo.create({
        owner: { id: userId },
        ...(cate && { cate }),
        ...args,
      }),
    );
    return { isSuccess: true, rest };
  }

  async updateRest(
    userId: number,
    { id, rest: { cateName, ...restArgs } }: UpdateRestDto,
  ): Promise<OutRestUpdate> {
    const isExist = await this.checkExist(id);
    this.checkIsMine(userId, isExist.ownerId);

    const cate = await this.cateRepo.createCate(cateName);
    await this.restRepo.save({
      id: isExist.id,
      ...(cate && { cate }),
      ...restArgs,
    });
    const newRest = await this.restRepo.findOne({ id });
    return { isSuccess: true, rest: newRest };
  }

  private async checkExist(restId: number) {
    const rest = await this.restRepo.findOne({ id: restId });
    if (!rest) throw new NotFoundException();
    return rest;
  }

  private checkIsMine(userId, ownerId) {
    if (userId !== ownerId) throw new UnauthorizedException();
  }

  async deleteRest(userId: number, restId: number): Promise<OutDelete> {
    const rest = await this.checkExist(restId);
    this.checkIsMine(userId, rest.ownerId);
    await this.restRepo.delete(restId);
    return { isSuccess: true, rest };
  }

  async findAllCate(args: FindAllCateDto): Promise<FindAllCate> {
    const take = 2;
    const skip = (args.page - 1) * take;
    const [data, totalResults] = await this.cateRepo.findAndCount({
      take,
      skip,
      relations: ['rest'],
    });
    const totalPages = Math.ceil(totalResults / take);
    return { data, totalPages, totalResults };
  }

  async countRest(cateId: number): Promise<number> {
    return this.restRepo.count({ cate: { id: cateId } });
  }

  async findCateBySlug(args: FindOneCateDto): Promise<OutFindOneCate> {
    const take = 2;
    const skip = (args.page - 1) * take;
    const date = await this.cateRepo.findOne({ slug: args.slug });
    const [rest, totalResults] = await this.restRepo.findAndCount({
      where: { cate: { id: date.id } },
      take,
      skip,
    });
    const totalPages = Math.ceil(totalResults / take);
    return { date, totalPages, totalResults, rest };
  }

  async findRests(args: FindRestDto): Promise<OutFindRestDto> {
    return this.coreService.getData(args.page, 'restRepo', {
      restRepo: 'findPage',
    });
  }

  async getOwnerName(id: number): Promise<string> {
    const r = await this.restRepo.findOne({ id }, { relations: ['owner'] });
    return r.owner.email;
  }

  async SearchRest(args: RestSearchDto): Promise<OutRestSestch> {
    return this.coreService.getData(args.page, 'restRepo', {
      restRepo: 'findByNamePage',
      options: { name: args.term },
    });
  }

  async findRestById(id: number): Promise<Rest> {
    return this.restRepo.findOne({ id }, { relations: ['dish'] });
  }

  async CreateDish(
    userId: number,
    args: CreateDishDto,
  ): Promise<OutCreateDish> {
    const rest = await this.restRepo.findOne({ id: args.restId });
    if (!rest) throw new NotFoundException();
    if (rest.ownerId !== userId) throw new UnauthorizedException();
    const data = await this.dishRepo.save(
      this.dishRepo.create({ ...args, rest }),
    );
    return { isSuccess: true, data };
  }

  async editDish(userId: number, args: EditDishDto): Promise<OutEditDish> {
    const dish = await this.dishRepo.findOne(
      { id: args.dishId },
      { relations: ['rest'] },
    );
    if (!dish) throw new NotFoundException();
    if (dish.rest.ownerId !== userId) throw new UnauthorizedException();
    await this.dishRepo.save({ id: args.dishId, ...args.dish });
    const edited = await this.dishRepo.findOne({ id: dish.id });

    return { isSuccess: true, dish: edited };
  }

  async deleteDish(userId: number, dishId: number): Promise<OutDeleteDish> {
    const dish = await this.dishRepo.findOne(
      { id: dishId },
      { relations: ['rest'] },
    );
    if (!dish) throw new NotFoundException();
    if (dish.rest.ownerId !== userId) throw new UnauthorizedException();

    await this.dishRepo.delete(dishId);

    return { isSuccess: true, dish };
  }
}
