import { CoreEntity } from './../../core/entities/core.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { IsUserAlreadyExist } from '../decorators/alreadyExist.decorator';

@ObjectType()
@Entity()
export class RestEntity extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  @IsUserAlreadyExist()
  name: string;

  @Column({ default: false })
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  isVagan?: boolean;

  @Column()
  @Field(() => String)
  @IsString()
  adress: string;

  @Column()
  @Field(() => String)
  @IsString()
  taste: string;
}
