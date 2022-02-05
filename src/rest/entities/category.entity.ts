import { getSlug } from './../../core/utility';
import { Rest } from './rest.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Core } from 'src/core/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IsCateExist } from '../validate/cate.validate';
@InputType('cateInputType', { isAbstract: true })
@Entity()
@ObjectType()
export class Cate extends Core {
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @IsCateExist({ message: 'exist slug name' })
  slug: string;

  @Column()
  @IsString()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  img?: string;

  @Field(() => [Rest])
  @OneToMany(() => Rest, (rest) => rest.cate)
  rest: Rest[];

  @BeforeInsert()
  @BeforeUpdate()
  insertSlug() {
    this.slug = getSlug(this.name);
  }
}
