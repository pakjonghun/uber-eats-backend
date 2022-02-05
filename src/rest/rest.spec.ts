import { CateRepo } from './repositories/cate.repository';
import { RestRepo } from './repositories/rest.repository';
import { RestService } from './rest.service';
import { Test } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import exp from 'constants';

const mockRestRepo = {
  save: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockCateRepo = {
  createCate: jest.fn(),
};

describe('restService', () => {
  let service: RestService;
  let restRepo: Partial<Record<keyof RestRepo, jest.Mock>>;
  let cateRepo: Partial<Record<keyof CateRepo, jest.Mock>>;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RestService,
        {
          provide: CateRepo,
          useValue: mockCateRepo,
        },
        {
          provide: RestRepo,
          useValue: mockRestRepo,
        },
      ],
    }).compile();
    service = module.get<RestService>(RestService);
    restRepo = module.get(RestRepo);
    cateRepo = module.get(CateRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRest', () => {
    const rest = { name: '', adress: '', img: '' };
    it('should return rest', async () => {
      restRepo.create.mockReturnValue(rest);
      restRepo.save.mockResolvedValue(rest);
      const r = await service.createRest(1, rest);
      expect(r).toStrictEqual({ isSuccess: true, rest });
    });

    it('should return error', async () => {
      try {
        restRepo.create.mockRejectedValue(new InternalServerErrorException());
      } catch (err) {
        expect(err).toStrictEqual(new InternalServerErrorException());
      }
    });
  });

  describe('editRest', () => {
    it('should throw not found exception', async () => {
      try {
        restRepo.findOne.mockResolvedValue(null);
        await service.updateRest(1, { id: 1, rest: { name: '' } });
      } catch (err) {
        expect(err).toStrictEqual(new NotFoundException());
      }
    });

    it('should throw unauthrized exception', async () => {
      try {
        restRepo.findOne.mockResolvedValue({ ownerId: 100 });
        await service.updateRest(1, { id: 2, rest: { name: 'a' } });
      } catch (err) {
        expect(err).toStrictEqual(new UnauthorizedException());
      }
    });

    it('should return success', async () => {
      restRepo.findOne.mockResolvedValue({ ownerId: 1 });
      cateRepo.createCate.mockResolvedValue({ id: 1 });
      restRepo.save.mockResolvedValue({ id: 1 });
      const r = await service.updateRest(1, {
        id: 1,
        rest: { id: 1, name: 'a' },
      });
      expect(r).toStrictEqual({ isSuccess: true, rest: { ownerId: 1 } });
    });
  });

  describe('restdelete', () => {
    it('should not found exception', async () => {
      try {
        restRepo.findOne.mockResolvedValue(null);
        await service.deleteRest(1, 1);
      } catch (err) {
        expect(err).toStrictEqual(new NotFoundException());
      }
    });

    it('should unauth exception', async () => {
      try {
        restRepo.findOne.mockResolvedValue({ ownerId: 1 });
        await service.deleteRest(2, 2);
      } catch (err) {
        expect(err).toStrictEqual(new UnauthorizedException());
      }
    });

    it('should return deleted rest', async () => {
      restRepo.findOne.mockResolvedValue({ ownerId: 1 });
      restRepo.delete.mockResolvedValue('');
      const r = await service.deleteRest(1, 2);
      expect(r).toStrictEqual({ isSuccess: true, rest: { ownerId: 1 } });
    });
  });
});
