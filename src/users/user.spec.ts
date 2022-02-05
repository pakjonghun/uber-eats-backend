import { Role } from './entities/users.entity';
import { JwtService } from './../jwt/jwt.service';
import { AuthService } from './../auth/auth.service';
import { EmailService } from './../email/email.service';
import { VerifyRepo } from './repository/verify.repository';
import { UserRepo } from './repository/user.repository';
import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  findAndCount: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  isExistById: jest.fn(),
});

const verifyRepository = () => ({
  createVerify: jest.fn(),
  delete: jest.fn(),
  findByCode: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  send: jest.fn(),
});

const mockAuthService = () => ({
  validate: jest.fn(() => Promise.resolve(1)),
});
// UserRepo, JwtService, VerifyRepo, EmailService

describe('userservice', () => {
  let service: UserService;
  let authService: AuthService;
  let emailService: EmailService;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
  let userRepo: Partial<Record<keyof UserRepo, jest.Mock>>;
  let verifyRepo: Partial<Record<keyof VerifyRepo, jest.Mock>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepo,
          useValue: mockRepository(),
        },
        {
          provide: VerifyRepo,
          useValue: verifyRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: EmailService,
          useValue: mockMailService(),
        },
        {
          provide: AuthService,
          useValue: mockAuthService(),
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    emailService = module.get<EmailService>(EmailService);
    userRepo = module.get(UserRepo);
    verifyRepo = module.get(VerifyRepo);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
  });
  it('be defined', () => {
    expect(service).toBeDefined();
  });
  describe('register', () => {
    it('should be called with userid', async () => {
      userRepo.save.mockReturnValue({
        id: 1,
        email: '',
        password: '',
        rold: '',
      });

      await service.register({
        email: '',
        password: '',
        role: 'Client',
      });

      expect(verifyRepo.createVerify).toHaveBeenCalledWith(1);
    });

    it('should be called with mailvalues', async () => {
      userRepo.save.mockResolvedValue({
        id: 1,
        email: '',
        password: '',
        role: '',
      });
      verifyRepo.createVerify.mockResolvedValue('code');

      const mailValues = {
        subject: 'title',
        template: 'authen',
        to: '',
      };
      const tempValues = {
        user: '1',
        href: 'https://naver.com',
        test: 'code',
      };
      await service.register({
        email: '',
        password: '',
        role: 'Client',
      });

      expect(emailService.send).toHaveBeenCalledTimes(1);
      expect(emailService.send).toHaveBeenCalledWith(mailValues, tempValues);
    });

    it('should be return success', async () => {
      userRepo.save.mockResolvedValue({
        id: 1,
        email: '',
        password: '',
        role: '',
      });
      verifyRepo.createVerify.mockResolvedValue('code');

      const r = await service.register({
        email: '',
        password: '',
        role: 'Client',
      });

      expect(r).toStrictEqual({
        isSuccess: true,
        user: { id: 1, email: '', password: '', role: '' },
      });
    });

    it('should return error', async () => {
      userRepo.save.mockRejectedValue(new Error(''));
      try {
        await service.register({
          email: '',
          password: '',
          role: 'Client',
        });
      } catch (e) {
        expect(e).toStrictEqual(new Error(''));
      }
    });
  });
  describe('login', () => {
    it('should called validate', async () => {
      await service.login({ email: '1', password: '1' });
      expect(authService.validate).toHaveBeenCalledTimes(1);
      expect(authService.validate).toHaveBeenCalledWith({
        email: '1',
        password: '1',
      });
    });

    it('should return true', async () => {
      const r = await service.login({ email: '1', password: '1' });
      expect(r).toStrictEqual({ isSuccess: true, token: 'token' });
    });

    it('should error', async () => {
      jwtService.sign.mockReturnValue(new Error(''));
      const r = await service.login({ email: '1', password: '1' });
      try {
      } catch (err) {
        expect(err).toStrictEqual(new Error(''));
      }
    });
    describe('findAll', () => {
      const user = { id: 1 };
      it('should return user', async () => {
        userRepo.findAndCount.mockResolvedValue([user, 1]);
        const r = await service.findAll({ page: 1 });
        expect(r).toStrictEqual(user);
      });

      it('should retrun error', async () => {
        userRepo.findAndCount.mockRejectedValue(new Error(''));
        try {
          await service.findAll({ page: 1 });
        } catch (err) {
          expect(err).toStrictEqual(new Error(''));
        }
      });
    });
  });
  describe('profile', () => {
    const args = { id: 1 };
    const user = { id: args.id, email: '1', role: 'Client' };
    it('should return exception', async () => {
      userRepo.findById.mockReturnValue(null);
      try {
        await service.profile(args);
      } catch (err) {
        expect(err).toStrictEqual(new NotFoundException());
      }
    });

    it('should return user', async () => {
      userRepo.findById.mockReturnValue(user);
      const r = await service.profile(args);
      expect(r).toStrictEqual(user);
    });
  });
  describe('update', () => {
    const id = 1;
    const user = { email: '', role: Role.Client };
    const newUser = { email: 'a', role: Role.Owner };

    it('should return new forbidden exception', async () => {
      userRepo.isExistById.mockResolvedValue(newUser);
      userRepo.findByEmail.mockResolvedValue(user);
      try {
        await service.update(id, newUser);
      } catch (err) {
        expect(err).toStrictEqual(new ForbiddenException());
      }
    });

    it('should return new user', async () => {
      userRepo.isExistById.mockResolvedValue(newUser);
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.save.mockResolvedValue({ id, ...newUser });
      userRepo.create.mockReturnValue({ id, ...newUser });
      const r = await service.update(id, newUser);
      expect(r).toStrictEqual({ isSuccess: true, UpdatedUser: newUser });
    });
  });
  describe('verify', () => {
    it('should return error', async () => {
      verifyRepo.findByCode.mockRejectedValue(new Error(''));
      try {
        await service.verify('code');
      } catch (err) {
        expect(err).toStrictEqual(new Error(''));
      }
    });
    it('should return notfound exception', async () => {
      verifyRepo.findByCode.mockReturnValue(null);
      try {
        await service.verify('1');
        expect(verifyRepo.findByCode).toHaveBeenCalledTimes(1);
      } catch (err) {
        expect(err).toStrictEqual(new NotFoundException());
      }
    });

    it('should return true', async () => {
      verifyRepo.findByCode.mockResolvedValue({
        id: 1,
        code: '1',
        user: { id: 1 },
      });
      userRepo.save.mockResolvedValue({ id: 1 });
      const r = await service.verify('1');
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(verifyRepo.delete).toHaveBeenCalledTimes(1);
      expect(verifyRepo.delete).toHaveBeenCalledWith(1);
      expect(r).toStrictEqual({ isSuccess: true });
    });
  });
});
