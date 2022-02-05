import { OutRestUpdate, UpdateRestDto } from './dtos/update.dto';
import { Cate } from './entities/category.entity';
import { CateRepo } from './repositories/cate.repository';
import { Users } from './../users/entities/users.entity';
import { RestRepo } from './repositories/rest.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OutRegisterRest, RegisterRestDto } from './dtos/register.dto';
import { OutDelete } from './dtos/delete.dto';
import { FindAllCate } from './dtos/catefind.dto';

@Injectable()
export class RestService {
  constructor(
    private readonly restRepo: RestRepo,
    private readonly cateRepo: CateRepo,
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

  async findAllCate(): Promise<FindAllCate> {
    const data = await this.cateRepo.find();
    return { data };
  }

  async countRest() {
    return this.restRepo.count();
  }
}
