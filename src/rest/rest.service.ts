import { RestRepository } from './repository/rest.repository';
import { UpdateRestDto } from './dto/update.dto';
import { SecondArgs, ThirdArgs } from './dto/create.dto';
import { RestEntity } from './entities/rest.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RestService {
  constructor(private readonly restRepository: RestRepository) {}
  test(id: number): Promise<RestEntity[]> {
    return this.restRepository.findByIds([id]);
  }
  mutation(args: SecondArgs): Promise<RestEntity> {
    return this.restRepository.save(args);
  }
  second(args: SecondArgs): Promise<RestEntity> {
    return this.restRepository.save(args);
  }
  third(args: ThirdArgs): Promise<RestEntity> {
    return this.restRepository.save(args);
  }
  async update({ id, data }: UpdateRestDto): Promise<boolean> {
    const target = await this.restRepository.findOne({ id });
    if (!target) throw new NotFoundException();
    await this.restRepository.save({ id, ...data });
    return true;
  }
  async findByName(name: string): Promise<number> {
    return this.restRepository.count({ name });
  }
}
