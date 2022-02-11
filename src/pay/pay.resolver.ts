import { SetRole } from './../auth/role.decorator';
import { CreatePayDto, OutCreatePay } from './dtos/createPay.dto';
import { Users } from 'src/users/entities/users.entity';
import { PayService } from './pay.service';
import { Pay } from './entities/pay.entity';
import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { User } from 'src/users/decorators/user.decorator';
import { OutFindPays, FindPaysDto } from './dtos/findPays.dto';

@Resolver(() => Pay)
export class PayResolve {
  constructor(private readonly payService: PayService) {}

  @Mutation(() => OutCreatePay)
  @SetRole(['Owner'])
  async createPay(
    @User() me: Users,
    @Args() args: CreatePayDto,
  ): Promise<OutCreatePay> {
    return this.payService.createPay(me.id, args);
  }

  @Query(() => OutFindPays)
  @SetRole(['Any'])
  async findPays(@Args() args: FindPaysDto): Promise<OutFindPays> {
    return this.payService.findPays(args);
  }
}
