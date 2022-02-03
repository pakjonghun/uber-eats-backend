import { CONFIG_OPTION } from './interface/jwt.constants';
import { Test } from '@nestjs/testing';
import { JwtService } from 'src/jwt/jwt.service';
import * as jsonwebtoken from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'token'),
    verify: jest.fn(() => ({ id: 1 })),
  };
});

describe('jwtService', () => {
  let service: JwtService;
  const secret = { privateKey: '1' };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtService, { provide: CONFIG_OPTION, useValue: secret }],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should defined', () => {
    expect(service).toBeDefined();
  });
  describe('sign', () => {
    it('should be called with args', () => {
      const t = service.sign(1);
      expect(t).toEqual('token');
      expect(jsonwebtoken.sign).toBeCalledTimes(1);
      expect(jsonwebtoken.sign).toBeCalledWith({ id: 1 }, '1', {
        expiresIn: 3600,
      });
    });

    it('should be called', () => {
      const r = service.verify('token');
      expect(r).toEqual(expect.any(Object));
      expect(jsonwebtoken.verify).toBeCalledTimes(1);
      expect(jsonwebtoken.verify).toBeCalledWith('token', '1');
    });
  });
  it.todo('sign');
});
