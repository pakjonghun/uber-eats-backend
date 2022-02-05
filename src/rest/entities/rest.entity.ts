import { Cate } from './category.entity';
import { Users } from './../../users/entities/users.entity';
import { User } from './../../users/decorators/user.decorator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Core } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

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

  @RelationId((rest: Rest) => rest.owner)
  ownerId?: number;
}
