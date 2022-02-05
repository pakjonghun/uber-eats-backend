import { Rest } from './../entities/rest.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Rest)
export class RestRepo extends Repository<Rest> {}
