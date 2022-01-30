## UberEats 클론코딩

## 노마드 코더 인강 따라하기

## gql

- codeFirst : 스키마 파일이 메모리에 저장된다.(별도로 작성 안해도 된다.)
  - typescript 기반이라서 위와 같이 작동한다.
  ```
     GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ```
- @Query

```
//타입을 반환하는 함수는 꼭 넣어줘야 한다. gql 방식으로 넣는다 string(x) String(o)
Query(typeFunc: ReturnTypeFunc, options?: QueryOptions):
```

- db 연결 host 를 인식을 못하길래 127.0.0.1로 하이 되었다.

```
await createConnection({
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: '',
        password: '',
        database: '',
        entities: [],
        synchronize: true,
      }).catch((err) => console.log(err)),
```

- db 연결시 일일히 entity 를 넣어주는 것 보다는 경로를 넣어주는게 더 편했다.

```
//custom provider 할 경우 dist 에서 js 를 연결해야 한다.
        entities: ['dist/**/*.entity{.ts,.js}'],

//@nest/typeorm 을 사용할 경우는 정상적으로 ts 를 연결하면된다.
entities: [__dirname + '/**/*.entity{.ts,.js}'],
```

## entity text는 3단계를 거쳐야 한다 (validator, graphql, database)

- typescript는요? 그건 아직 잘 모르겠다. 타입 스크립도 옵션에 맞춰서 통일 시켜주자.!

```
  @Column({ default: false })  //database
  @IsOptional()  //validator
  @IsBoolean()
  @Field(() => Boolean, { defaultValue: false }) //graphql
  isVagan?: boolean; //typescript
```

- map type은 @InputType 일때 사용가능하다(대신 다른 타입으로 변경도 가능하다)

```
@InputType()  //이 타입을 빼면 오류가 발생한다.
class UpdateData extends OmitType(
  PartialType(RestEntity),
  ['id', 'updatedAt', 'createdAt'],
  InputType,  //부모타입을 안따라가려면 이렇게 적어준다. dto 때는 필수(inputtype argtype 둘중에 하나로 해야함.)
) {}
```

- class-validator 로 중복되는 not found exception 을 피할 수 있다.
- transform 까지 같이 사용하면서 데코레이터를 커텀 한다면 꽤 괜찮을 것 같음.
