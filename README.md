# 우리 반 홈페이지

Next.js(App Router) + Prisma + Vercel Postgres + Vercel Blob으로 만든 학급 홈페이지입니다.

## 포함된 기능

- **메인 페이지**: 대표 사진, 공지/소통방/소식 요약
- **학급 소개**: 관리자가 내용 수정 가능한 소개 페이지
- **공지·소통**: 공지사항 게시판(선생님만 작성) + 소통방 게시판(학생 로그인 후 글·댓글 작성)
- **구성원 소개**: 목록 → 이름(사진) 클릭 시 개인 상세 페이지, 본인/관리자만 프로필(자기소개·사진) 수정
- **소식 게시판**: 사진 여러 장 + 파일 첨부 가능
- **로그인/회원가입**: 이메일+비밀번호 (NextAuth Credentials)
- **관리자 페이지** (`/admin`): 메인 대표 사진·학급 소개 문구 수정, 구성원 권한(선생님/학생)·번호 관리

## 기술 스택

- Next.js 15 (App Router, Server Actions)
- Prisma + PostgreSQL (Vercel의 **Prisma Postgres** 스토리지 사용을 권장)
- NextAuth v5 (Credentials 로그인, JWT 세션)
- Vercel Blob (사진·파일 저장)
- Tailwind CSS

## 로컬 개발 방법

```bash
npm install
cp .env.example .env   # 값 채워넣기 (아래 참고)
npx prisma migrate dev --name init
npm run seed            # 관리자(선생님) 계정 생성
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

## Vercel 배포 방법 (GitHub 연동 자동 배포)

### 1. GitHub에 코드 올리기

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <내-깃허브-저장소-주소>
git push -u origin main
```

### 2. Vercel에서 프로젝트 가져오기

1. https://vercel.com 에서 로그인 후 **Add New → Project**
2. 방금 올린 GitHub 저장소 선택 → Import

### 3. 데이터베이스 연결 (Vercel Postgres)

1. 프로젝트의 **Storage** 탭 → **Create Database** → **Prisma Postgres** 선택
   - Prisma Postgres를 선택하면 `DATABASE_URL`, `DIRECT_URL` 환경변수가 프로젝트에 자동으로 연결됩니다. (본 프로젝트의 `prisma/schema.prisma`가 이 두 변수를 그대로 사용하도록 되어 있습니다.)
2. 만약 Neon 등 다른 Postgres를 연결했다면, 환경변수 이름을 `DATABASE_URL` / `DIRECT_URL`로 맞춰주세요.

### 4. 파일 저장소 연결 (Vercel Blob)

1. **Storage** 탭 → **Create Database** → **Blob** 선택 후 프로젝트에 연결
   - `BLOB_READ_WRITE_TOKEN` 환경변수가 자동으로 채워집니다.

### 5. 나머지 환경변수 설정 (Project → Settings → Environment Variables)

| 변수명 | 설명 |
|---|---|
| `AUTH_SECRET` | `openssl rand -base64 32` 로 생성한 임의의 문자열 |
| `ADMIN_NAME` | 최초 관리자(선생님) 이름 |
| `ADMIN_EMAIL` | 최초 관리자 로그인 이메일 |
| `ADMIN_PASSWORD` | 최초 관리자 비밀번호 (배포 후 꼭 변경하세요) |

### 6. 배포 및 최초 관리자 계정 생성

1. 위 환경변수를 넣은 뒤 **Deploy** (또는 재배포)
2. 배포가 끝나면 로컬 터미널에서 프로덕션 DB에 스키마를 반영합니다.

```bash
# .env.local 등에 Vercel의 DATABASE_URL / DIRECT_URL 값을 넣고
npx prisma migrate deploy
npm run seed
```

또는 Vercel 대시보드의 **Storage → Prisma Postgres → Query** 콘솔이나, 로컬에서 `vercel env pull`로 환경변수를 받아온 뒤 위 명령을 실행해도 됩니다.

3. 이후 GitHub `main` 브랜치에 push할 때마다 Vercel이 자동으로 빌드·배포합니다.

## 사용 흐름

1. 관리자(선생님)는 seed로 만든 계정으로 로그인 → `/admin`에서 대표 사진·학급 소개·공지 작성
2. 학생은 `/register`에서 직접 회원가입 후 로그인 → 소통방 글쓰기/댓글, 소식 올리기, 내 프로필(자기소개·사진) 수정 가능
3. 관리자는 `/admin`에서 학생 번호를 지정하거나 필요시 다른 계정을 "선생님(관리자)"으로 승격할 수 있습니다.

## 참고

- `npm audit` 기준 Next.js가 내부적으로 번들링하는 postcss(빌드 도구용, 사용자 입력을 처리하지 않음)에 대한 항목이 하나 남아 있습니다. 런타임에 영향이 없는 빌드 도구 의존성이라 실사용에 지장은 없지만, 추후 Next.js가 해당 의존성을 업데이트하면 `npm update`로 함께 해소됩니다.
- 파일 업로드 용량은 기본 8MB로 제한되어 있습니다. 필요시 `app/api/upload/route.ts`에서 조정할 수 있습니다.
