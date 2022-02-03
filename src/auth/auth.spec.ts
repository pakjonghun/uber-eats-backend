import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { UserRepo } from './../users/repository/user.repository';

const mockRepo = () => ({
  findByEmail: jest.fn(),
});

describe('auth', () => {
  let service: AuthService;
  let userRepo: Partial<Record<keyof UserRepo, jest.Mock>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, { provide: UserRepo, useValue: mockRepo() }],
    }).compile();
    userRepo = module.get(UserRepo);
    service = module.get<AuthService>(AuthService);
  });

  const user = { email: '', password: '' };

  describe('validate', () => {
    it('should error', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      try {
        await service.validate(user);
      } catch (err) {
        expect(err).toStrictEqual(new UnauthorizedException());
      }
    });

    it('should return unauth error', async () => {
      const UserEntity = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };

      userRepo.findByEmail.mockResolvedValue(UserEntity);
      try {
        const a = await service.validate(user);
        expect(a).toBe(1);
      } catch (err) {
        expect(err).toStrictEqual(new UnauthorizedException());
      }
    });

    it('should return unauth error', async () => {
      const UserEntity = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };

      userRepo.findByEmail.mockResolvedValue(UserEntity);
      try {
        const a = await service.validate(user);
        expect(a).toBe(1);
      } catch (err) {
        expect(err).toStrictEqual(new UnauthorizedException());
      }
    });
  });
});
