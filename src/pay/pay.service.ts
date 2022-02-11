import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CoreService } from './../core/core.service';
import { FindPaysDto, OutFindPays } from './dtos/findPays.dto';
import { RestRepo } from './../rest/repositories/rest.repository';
import { CreatePayDto, OutCreatePay } from './dtos/createPay.dto';
import { PayRepo } from './repositories/pay.repo';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LessThan, Raw } from 'typeorm';

@Injectable()
export class PayService {
  constructor(
    private readonly payRepo: PayRepo,
    private readonly restRepo: RestRepo,
    private readonly coreService: CoreService,
    private readonly scheduel: SchedulerRegistry,
  ) {}

  async createPay(userId: number, args: CreatePayDto): Promise<OutCreatePay> {
    const isRestExist = await this.restRepo.findOne(args.restId);

    if (!isRestExist) throw new NotFoundException('rest is not exist');
    if (isRestExist.ownerId !== userId)
      throw new UnauthorizedException('you are not rest owner');
    const promoteUntil = new Date(Date.now() + 24 * 100 * 60 * 60 * 7);

    const data = await this.payRepo.save(
      this.payRepo.create({
        ...args,
        rest: { id: args.restId, isPromited: true, promoteUntil },
        user: { id: userId },
      }),
    );

    await this.restRepo.save([
      {
        id: args.restId,
        isPromited: true,
        promoteUntil,
      },
    ]);

    return { isSuccess: true, data };
  }

  async findPays(args: FindPaysDto): Promise<OutFindPays> {
    return this.coreService.getData(args.page, 'payRepo', {
      payRepo: 'findPays',
    });
  }

  @Cron('30,*,*,*,*,*', { name: 'payCorn' })
  async checkOutPay() {
    console.log('rest check');
    const pays = await this.restRepo.find({
      where: {
        isPromited: true,
        promoteUntil: Raw((alias) => `${alias}<:date`, { date: new Date() }),
      },
      select: ['id'],
    });

    const entities = pays.map((pay) => ({
      id: pay.id,
      isPromited: false,
      promoteUntil: null,
    }));

    await this.restRepo.save(entities);
  }
}
