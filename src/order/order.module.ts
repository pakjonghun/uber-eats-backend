import { DishRepo } from './../rest/repositories/dishRepo';
import { ItemRepo } from './repositories/item.repo';
import { RestModule } from './../rest/rest.module';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderRepo } from './repositories/order.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepo, ItemRepo, DishRepo]),
    RestModule,
  ],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
