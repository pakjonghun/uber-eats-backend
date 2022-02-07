import { Dish } from './../entities/dish.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Dish)
export class DishRepo extends Repository<Dish> {}
