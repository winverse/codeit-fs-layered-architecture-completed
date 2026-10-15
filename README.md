# Layered Architecture Completed

이 프로젝트는 `Layered Architecture` 교재를 시작 코드에서 끝까지 따라 만든 최종 상태입니다. 라우터 안에 함께 있던 HTTP 처리, 비즈니스 규칙, 데이터 접근, 외부 라이브러리 연동 코드를 `src/controllers/`(Controller), `src/services/`(Service), `src/repositories/`(Repository), `src/providers/`(Provider)로 나눴습니다. 객체를 만들고 연결하는 일은 `src/common/di/container.js`의 Awilix 컨테이너가 맡고, Express 앱 구성은 `src/app.js`의 `App` 클래스가, 서버 시작은 `src/main.js`의 `bootstrap()`이 맡습니다.

## 최종 구조

- `src/controllers/`: `BaseController`를 상속한 `AuthController`·`UserController`, 두 Controller의 경로를 `/api` 아래에 모으는 최상위 `Controller`, 요청 검증 스키마(`dto/`)
- `src/services/`: 회원가입·로그인·사용자 CRUD의 비즈니스 규칙을 담당하는 `AuthService`·`UserService`
- `src/repositories/`: Prisma 쿼리를 감추는 `UserRepository`
- `src/providers/`: `bcrypt`·`jsonwebtoken`·쿠키 처리를 감싼 `PasswordProvider`·`TokenProvider`·`CookieProvider`
- `src/middlewares/`: 인증 `AuthMiddleware`, 로그인 여부를 확인하는 `needsLogin`, 입력 검증·CORS·에러 처리 미들웨어
- `src/common/`: 상수·예외·정상 종료 처리와 Awilix 컨테이너(`di/container.js`)
- `src/config/`, `src/prisma/`: 환경 변수 검증, Prisma 8 계약(`contract.prisma`)·emit 결과물·데이터베이스 연결 파일(`db.js`)
- `public/`: API 결과를 확인하는 로컬 테스트 화면

## 시작하기

1. 의존성을 설치합니다.

```bash
pnpm install
```

2. 로컬 PostgreSQL에 비어 있는 `prisma_auth` 데이터베이스를 만듭니다. `psql`로
   접속한 뒤 아래 SQL을 실행합니다.

```sql
CREATE DATABASE prisma_auth;
```

3. `env/.env.example`을 `env/.env.development`로 복사하고 PostgreSQL 연결 정보와
   서로 다른 JWT 비밀키 두 개를 입력합니다.

4. 비어 있는 데이터베이스에 계약의 테이블을 만듭니다. emit 결과물은 저장소에
   포함되어 있으므로 계약을 바꾸지 않았다면 emit을 다시 실행하지 않아도 됩니다.

```bash
pnpm prisma:init
```

계약(`src/prisma/contract.prisma`)을 바꿨다면 `pnpm prisma:emit`으로 결과물을
다시 만들고, 이미 테이블이 있는 데이터베이스에는 `pnpm prisma:update`로 변경을
반영합니다.

초기 데이터가 필요하면 `pnpm seed`를 실행합니다. 이 명령은 `localhost:5432`의
`prisma_auth` 개발 데이터베이스에서만 동작하며 기존 사용자 데이터를
초기화합니다.

5. 개발 서버를 실행합니다.

```bash
pnpm dev
```

터미널에 `[development] Server running at http://localhost:5001`이 보이면
`http://localhost:5001/api` 아래의 인증·사용자 API를 호출할 수 있습니다.
브라우저에서 `http://localhost:5001`에 접속하면 `public/`의 테스트 화면에서
회원가입·로그인·사용자 목록 조회와 `/api/ping` 응답을 확인할 수 있습니다.
`Ctrl + C`로 서버를 종료하면 `서버가 종료되었습니다.`와
`데이터베이스 연결이 종료되었습니다.`가 차례로 출력됩니다.

## 확인하기

서버를 실행해 둔 채 다른 터미널에서 아래 명령을 실행하면, 성공해야 하는 요청과
실패해야 하는 요청을 차례로 보내 API가 기대한 상태 코드로 응답하는지
확인합니다. 모두 통과하면 `Layered Architecture API 검증을 통과했습니다.`가
출력됩니다.

```bash
pnpm verify:api
```

포맷과 린트는 `pnpm format:check`와 `pnpm lint`로 확인합니다.
