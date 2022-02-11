import { PayRepo } from './../pay/repositories/pay.repo';
import { OrderRepo } from './../order/repositories/order.repo';
import { CORE_OPTIONS } from './core.constants';
import { Repo, Condition, Pagenatigon } from './interfaces/page.interface';
import { RestRepo } from './../rest/repositories/rest.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  constructor(
    @Inject(CORE_OPTIONS) private readonly options: Pagenatigon,
    private readonly restRepo: RestRepo,
    private readonly orderRepo: OrderRepo,
    private readonly payRepo: PayRepo,
  ) {}

  private getSkip(page = 1) {
    return (page - 1) * this.options.take;
  }

  private getTotalPages(totalResults: number) {
    return Math.ceil(totalResults / this.options.take);
  }

  async getData(page: number, repo: Repo, condition?: Condition) {
    const [data, totalResults] = await this[repo][condition[repo]](
      this.options.take,
      this.getSkip(page),
      condition,
    );

    return { data, totalResults, totalPages: this.getTotalPages(totalResults) };
  }
}
