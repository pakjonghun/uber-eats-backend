import { getConnection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('rest', () => {
  let token: string;
  let app: INestApplication;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('create rest', () => {
    it('should create register user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{
        register(role:Owner,email:"fire@gmail.com",password:"12345"){
          isSuccess
        }
        }`,
        })
        .expect(200);
    });

    it('should return token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation{
        login(email:"fire@gmail.com",password:"12345"){
          token
        }
        }`,
        })
        .expect(200)
        .expect((res) => {
          token = res.body.data.login.token;
          return expect(token).toStrictEqual(expect.any(String));
        });
    });

    it('should create rest', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('authorization', token)
        .send({
          query: `mutation{
        createRest(args:{name:"ab",adress:"a",img:"a",cateName:"ac"}){
          rest{
            id
          }
        }
        }`,
        })
        .expect(200)
        .expect((res) => expect(res.body.data.createRest.rest.id).toBe(1));
    });
  });

  describe('rest edit', () => {
    it('should return 200', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('authorization', token)
        .send({
          query: `mutation{
      updateRest(id:1,rest:{name:"k2bx",cateName:"kb-2"}){
       rest{
        id
        name
        adress
      }
      }
      }`,
        })
        .expect(200)
        .expect((res) =>
          expect(res.body.data.updateRest.rest.name).toBe('k2bx'),
        );
    });

    it('should return not found exception', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('authorization', token)
        .send({
          query: `mutation{
        updateRest(id:2,rest:{name:"k2bx",cateName:"kb-2"}){
         rest{
          id
          name
          adress
        }
        }
        }`,
        })
        .expect(200)
        .expect((res) => expect(res.body.errors).toEqual(expect.any(Array)));
    });
  });

  describe('delete rest', () => {
    it('should return deleted rest', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('authorization', token)
        .send({
          query: `mutation{
            deleteRest(id:29){
              rest{
                id
              }
            }
          }`,
        })
        .expect(200);
    });
  });
});
