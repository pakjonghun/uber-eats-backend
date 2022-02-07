import { OrderRep } from './repositories/order.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({ imports: [TypeOrmModule.forFeature([OrderRep])] })
export class OrderModule {}
