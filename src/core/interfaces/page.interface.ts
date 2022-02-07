import { CateRepo } from './../../rest/repositories/cate.repository';
import { RestRepo } from './../../rest/repositories/rest.repository';
export interface Pagenatigon {
  take: number;
}

export type Repo = 'restRepo' | 'cateRepo';

export type MethodName = 'pagnationRest';

export type SearchOptions = {
  name?: string;
  id?: number;
};

export interface Condition {
  options?: SearchOptions;
  restRepo?: Partial<keyof RestRepo>;
  cateRepo?: Partial<keyof CateRepo>;
}
