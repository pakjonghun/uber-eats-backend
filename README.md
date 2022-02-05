## UberEats 클론코딩

## 노마드 코더 인강 따라하기

## 찾기 어려운 실수

- 비동기가 아닌데 비동기로 처리 할 경우
  - 몰랐었는데 서버가 죽는다. 깜짝 놀라서 왜 그런지 찾다가 알게되었다.
  - gql 모듈까지 에러가 가지도 않고 바로 그 자리에서 서버가 죽어버린다.

## Test

- 테스트 환경도 본섭과 똑같이 만들어 주자 예)

```
app.useGlobalPipes(new ValidationPipe());
```

- Record<keyof T,P> : T의 각 타입을 P타입세트로으로 합친다.
  ```
  Record<keyof Repository<UserRepo>, jest.Mock>
  ```
- can'f find module error(경로 찾는 방식을 알려준다.)

```
  "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/$1"
    },
```

## 주의할점

- gql 의 dto 는 entity 와 연결되어서 input type 인지 argType 인지 에 따라 스키마 에 영향을 주므로 조심해야 한다.

  - 이제까지는 한번 더 depth 를 타는것이 싫어서 argType으로 적용했는데
  - 이렇게 되면 일일히 argType 이라고 명시를 해주어야 하는 번거로움이 있었음.
  - 게다가 스키마 이름이 중복되면 안되므로 inputtype 를 해서 사용하는 경우 이름을 다르게 지정해 줘야 했다.
  - 다른방법으로 entity 에 @InputType('inputName',{abstract:true})방법은
  - 뎁스를 한번 더 타는 대신 일일히 타입을 명시해주는 번거로움이 줄어든다.
  - 또 다른 방법을 두 가지 방법을 섞는 방법이다. inputtype을 사용할때를 대비해서 미리 @inputType('name',{abstract:true})를 미리 넣어두고 사용하는 방법이다.
  - 일단 지금 하는 방식으로 해도 상관은 없을 듯 하지만 장단점을 잘 따져야 할 것 같다.

- map type 을 할때 ArgsTypes안에 들어가는 타입은 inputType 이 되야 함(object 일 경우에만)
- service 와 repo 를 나누면 순환참조 할 일이 없다. typeorm repo custom 방법 https://docs.nestjs.com/techniques/database#custom-repository
- 순환참조 할 경우 doc 참고 할 것 https://docs.nestjs.com/fundamentals/circular-dependency
- dynamic module 로 사용하면 Global()로 모듈을 설정하지 않는 이상 다른 모듈에서 임포트 받을때 프로바이더 까지 설정 해줘야 하는 번거로움이 있다

- 여기서 다이나믹 모듈의 프로바이더가 다이나믹 모듈에 들어온 인자를 주입받으면 그 프로바이더를 다른 모듈에서 사용하는데 더 어려움이 생긴다.(그냥 사용 안되고 오류가 뜸... )

- 그러므로 커스텀 프로바이더를 다이나믹 모듈과 꼭 같이 사용 해야 겠다면 그냥 @Global()로 만든후 다른 모듈에서 사용하던가

- 다이나믹 말고 커스텀 프로바이더만 사용하면서 사용해야 할 인자 같은게 있다면 별도 파일에서 상수로 만든후에 가져오는게 더 낫다.

- @Module 모듈 데코레이터 안에서 exports 를 해주고 있으면 import 받는 곳에서 사용할 provider 를 providers 에 다시 안 넣어줘도 됨. imports 에 모듈만 넣어주면 알아서 처리됨.

- dynamicModule 에서 exports 된 provider는 import 받는 곳에서 imports 에 모듈 넣어주고, providers 에 provider 까지 넣어줘야 의존성 주입이 됨.

- DynamicModule 을 사용하던 @Module 데코레이터를 사용하던지 어쨋든 간에 export 하는 곳에서 @Global() 하면 import 받는 곳에서 임포트도 필요없고 프로바이더에 뭘 넣어줄 필요도 없음. 단 자주 사용하는 것만(config 같은것) 하는것이 좋다고 함.(구글링)

- entities 경로는 dist 폴더도 검색한다.(js 를 포함해야 하며, 엔티티 삭제나 모듈 삭제후 dist 도 함께 지워야 안전하다.)

```
entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
```

- 최대한 기능은 잘게 종류별로 모듈로 쪼개서 서비스에 넣고 재활용 해야 한다.

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

- db 연결 host 를 인식을 못하길래 127.0.0.1로 입력했다.

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

- db 연결시 일일히 entity 를 넣어주는 것 보다는 경로를 넣어주는게 더 편했다. 단 module 삭제시 dist 를 새로 업뎃 해야 오류가 발생하지 않는다.

```
//custom provider 할 경우 dist 에서 js 를 연결해야 한다.
        entities: ['dist/**/*.entity{.ts,.js}'],

//@nest/typeorm 을 사용할 경우는 정상적으로 ts 를 연결하면된다.
entities: [__dirname + '/**/*.entity{.ts,.js}'],
```

## entity text는 3단계를 거쳐야 한다 (validator, graphql, database)

- typescript는요? 그건 아직 잘 모르겠다. 타입 스크립도 일단 옵션에 맞춰서 통일 시켜줬다.

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
- transform 까지 같이 사용하면서 데코레이터를 커스텀 한다면 꽤 괜찮을 것 같으나 거기까지 할 일은 거의 없을듯 하다.
