import { Pay } from './../../pay/entities/pay.entity';
import { OrderEntity } from './../../order/entities/order.entity';
import { Dish } from './dish.entity';
import { Cate } from './category.entity';
import { Users } from './../../users/entities/users.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Core } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

@InputType('restInputType', { isAbstract: true })
@Entity()
@ObjectType()
export class Rest extends Core {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  img?: string;

  @Column()
  @Field(() => String)
  @IsString()
  adress: string;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.rest, { onDelete: 'CASCADE' })
  owner?: Users;

  @Field(() => Cate, { nullable: true })
  @ManyToOne(() => Cate, (cate) => cate.rest, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  cate?: Cate;

  @OneToMany(() => Dish, (dish) => dish.rest)
  @Field(() => [Dish])
  dish: Dish[];

  @OneToMany(() => OrderEntity, (order) => order.rest, { nullable: true })
  @Field(() => [OrderEntity], { nullable: true })
  order?: OrderEntity[];

  @OneToMany(() => Pay, (pay) => pay.rest, { nullable: true })
  @Field(() => [Pay], { nullable: true })
  pay?: Pay[];

  @RelationId((rest: Rest) => rest.cate)
  cateId?: number;

  @RelationId((rest: Rest) => rest.owner)
  ownerId?: number;

  @IsBoolean()
  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  isPromited: boolean;

  @IsDate()
  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  promoteUntil: Date;
}
