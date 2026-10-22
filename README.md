# 숨 스튜디오 스타터 저장소

FDE 빌더 1주차 수업에서 쓰는 스타터 저장소입니다. 필라테스 스튜디오 "숨"(가상)의 예약 웹앱을 이 저장소에서 만들어 갑니다.

## 들어 있는 것

| 폴더 | 하는 일 | 주소 |
|---|---|---|
| `apps/web` | 화면 서버 (Next.js) | http://localhost:3000 |
| `apps/api` | 처리 서버 (NestJS) | http://localhost:4000 , 상태 확인은 /health |
| `apps/api/prisma/schema.prisma` | DB 구조 (지점, 강사, 수업, 회원, 회원권, 예약) | |
| `apps/api/prisma/sample.ts` | 가상 데이터 넣기 | |

## 시작하기

Claude Code에게 이렇게 부탁하면 됩니다.

```txt
이 저장소의 README와 CLAUDE.md를 읽고, DB 주소는 [Render에서 복사한 외부 주소]를 써서
DB에 표를 만들고 화면 서버와 처리 서버를 켜 줘.
```

직접 할 때는 아래 순서입니다.

1. `apps/api/.env.example`을 복사해 `apps/api/.env`를 만들고 `DATABASE_URL`을 채웁니다.
2. `apps/web/.env.example`을 복사해 `apps/web/.env.local`을 만듭니다.
3. `npm run setup` → `npm run db:push` → 필요하면 `npm run db:sample`
4. 터미널 두 개에서 `npm run dev:api`, `npm run dev:web`
