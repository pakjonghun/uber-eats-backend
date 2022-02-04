import { VerifyRepo } from './../src/users/repository/verify.repository';
import { UserRepo } from './../src/users/repository/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

const GRAPHQL_ENDPOINT = '/graphql';
const EMAIL = 'fireking5997@gmail.com';
const PASSWORD = '12345';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userRepo: UserRepo;
  let verifyRepo: VerifyRepo;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    verifyRepo = app.get<VerifyRepo>(VerifyRepo);
    userRepo = app.get<UserRepo>(UserRepo);
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  const commonTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const privateTest = (query: string) =>
    commonTest().set('authorization', token).send({ query });
  const publicTest = (query: string) => commonTest().send({ query });

  describe('register', () => {
    it('should register account', async () => {
      return publicTest(`mutation{
        register(email:"${EMAIL}",
          password:"${PASSWORD}"){
          isSuccess
          user{
            id
            isEmailVerified
          }
        }
      }`)
        .expect(200)
        .expect((res) => expect(res.body.data.register.isSuccess).toBeTruthy())
        .expect((res) => expect(res.body.data.register.error).toBe(undefined));
    });

    it('should return error', async () => {
      return publicTest(`mutation{
        register(email:"${EMAIL}",
          password:"${PASSWORD}"){
          isSuccess
          user{
            id
            isEmailVerified
          }
        }
      }`)
        .expect(200)
        .expect((res) => expect(res.body.data).toBe(null))
        .expect((res) => expect(res.body.errors).toEqual(expect.any(Array)));
    });
  });

  describe('login', () => {
    it('should throw error', async () => {
      return publicTest(`mutation{
        login(email:"karolos5997@gmail.com",password:"${PASSWORD}"){
           token
        }
      }`)
        .expect(200)
        .expect((res) => expect(res.body.data).toEqual(null))
        .expect((res) => expect(res.body.errors).toEqual(expect.any(Array)));
    });

    it('should login', async () => {
      return publicTest(`mutation{
        login(email:"${EMAIL}",password:"12345"){
           token
           isSuccess
        }
      }`)
        .expect(200)
        .expect((res) => {
          token = res.body.data.login.token;
          return expect(res.body.data.login.token).toEqual(expect.any(String));
        })
        .expect((res) => expect(res.body.data.login.isSuccess).toBeTruthy());
    });
  });

  describe('update', () => {
    let id: number;
    const newEmail = 'karolos5997@gmail.com';
    beforeAll(async () => {
      const [user] = await userRepo.find();
      id = user.id;
    });

    it('should', () => {
      return privateTest(`mutation{
        update(id:${id},user:{email:"${newEmail}",password:"123456"}){
           UpdatedUser{
            email
          }
          isSuccess
        }
      }`)
        .expect(200)
        .expect((res) =>
          expect(res.body.data.update.UpdatedUser.email).toBe(newEmail),
        );
    });

    it('should throw error', () => {
      return privateTest(`mutation{
        update(id:2,user:{email:"karolos5997@naver.com",password:"123456"}){
           UpdatedUser{
            email
          }
          isSuccess
        }
      }`)
        .expect(200)
        .expect((res) => expect(res.body.data).toEqual(null))
        .expect((res) => expect(res.body.errors).toEqual(expect.any(Array)));
    });
  });

  describe('me', () => {
    it('should return me', () => {
      return privateTest(`{
        me{
          id
          isEmailVerified
          updatedAt
        }
      }`)
        .expect(200)
        .expect((res) => expect(res.body.data.me.id).toBe(1));
    });

    it('should not return me', () => {
      return privateTest(`{
        me{
          id
          isEmailVerified
          password
          updatedAt
        }
      }`)
        .set('authorization', token)
        .expect(200)
        .expect((res) => expect(res.body.data.me).toBe(null))
        .expect((res) => expect(res.body.errors).toEqual(expect.any(Array)));
    });
  });
  describe('profile', () => {
    it('should return profile', () => {
      return privateTest(`
      {
        profile(id:1){
          email,
          role
        }
      }
      `)
        .expect(200)
        .expect((res) => expect(res.body.data.profile.role).toBe('Client'));
    });

    it('should return error', () => {
      return privateTest(`
      {
        profile(id:2){
          email,
          role
        }
      }
      `)
        .expect(200)
        .expect((res) => expect(res.body.errors).toEqual(expect.any(Array)))
        .expect((res) => expect(res.body.data).toBe(null));
    });
  });

  describe('verifyEmail', () => {
    let code: string;
    beforeAll(async () => {
      const [v] = await verifyRepo.find();
      code = v.code;
    });

    it('should return email', () => {
      return privateTest(`mutation{
        verifyEmail(code:"${code}"){
          isSuccess
        }
      }`)
        .expect(200)
        .expect((res) =>
          expect(res.body.data.verifyEmail.isSuccess).toBeTruthy(),
        );
    });

    it('should return fail', () => {
      return privateTest(`mutation{
        verifyEmail(code:"asdf"){
          isSuccess
        }
      }`)
        .expect(200)
        .expect((res) => expect(res.body.data).toBe(null))
        .expect((res) => expect(res.body.errors).toEqual(expect.any(Array)));
    });
  });
});
