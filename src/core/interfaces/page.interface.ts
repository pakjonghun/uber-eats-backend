import { PayRepo } from './../../pay/repositories/pay.repo';
import { OrderStatus } from './../../order/entities/order.entity';
import { Roles } from 'src/auth/role.decorator';
import { OrderRepo } from './../../order/repositories/order.repo';
import { CateRepo } from './../../rest/repositories/cate.repository';
import { RestRepo } from './../../rest/repositories/rest.repository';
export interface Pagenatigon {
  take: number;
}

export type Repo = 'restRepo' | 'cateRepo' | 'orderRepo' | 'payRepo';

export type MethodName = 'pagnationRest';

export type SearchOptions = {
  name?: string;
  id?: number;
  role?: Roles;
  status?: keyof typeof OrderStatus;
};

export interface Condition {
  options?: SearchOptions;
  restRepo?: Partial<keyof RestRepo>;
  cateRepo?: Partial<keyof CateRepo>;
  orderRepo?: Partial<keyof OrderRepo>;
  payRepo?: Partial<keyof PayRepo>;
}
