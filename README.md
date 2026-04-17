# EverHero

EverHero는 DC형 퇴직연금 운영 담당자를 위한 관리 플랫폼 데모입니다.  
주요 사용자는 약 500명 규모 회사에서 퇴직연금 실무를 맡고 있는 인사, 재무, 총무 담당자이며, 이 사용자가 전사 현황을 빠르게 파악하고 우선 관리 대상을 선별하며 설명 가능한 근거를 바탕으로 내부 보고와 직원 안내를 준비할 수 있도록 돕는 것을 목표로 합니다.

## 현재 구현 범위

현재 구현된 주요 화면은 아래와 같습니다.

- `/` 대시보드
- `/employees` 직원 관리
- `/employees/[id]` 직원 상세
- `/diagnosis` 진단
- `/compliance` 컴플라이언스 데모
- `/simulation` 은퇴 시뮬레이터

## 현재 동작하는 핵심 기능

### 대시보드

- 총 직원 수, 총 적립금, 평균 수익률, 관리 필요 대상 표시
- 위험 유형별 알림 카드 제공
- 현재 대시보드 수치와 상단 임직원 수 배지는 `employees` 테이블 기준으로 계산

### 직원 관리

- 직원명 또는 부서 검색
- 부서 필터
- 연령대 필터
- 위험 플래그 필터
- 정렬
- 빠른 필터
- 관리 우선도 표시
- 한글 검색 입력 시 조합이 깨지지 않도록 입력 조합 처리 보완

### 직원 상세

- 직원 기본 정보
- 포트폴리오 구성
- 위험 플래그
- 진단 요약
- 리밸런싱 시뮬레이션 카드

### 진단

- 개인 진단
- 전사 진단
- 룰 기반 점수와 설명 문구 제공

### 컴플라이언스

- 운영 점검용 데모 화면

### 은퇴 시뮬레이터

- 직원 선택 기반 시뮬레이션
- 은퇴 시점별 예상 적립금과 수령액 비교

## 데이터 구조

앱의 주요 데이터 접근은 `lib/data.ts`를 통해 이루어집니다.

우선순위는 아래와 같습니다.

1. Supabase 환경변수가 설정되어 있고 조회가 성공하면 Supabase 데이터 사용
2. 그렇지 않으면 로컬 mock 데이터 사용

즉, Supabase 연결 전에도 앱은 동작하고, 연결 후에는 실제 DB 데이터를 우선 사용합니다.

## Supabase 관련 파일

- `lib/supabase.ts`
- `lib/data.ts`
- `supabase/schema.sql`
- `supabase/seed.sql`
- `scripts/generate-supabase-seed.mjs`

## 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 넣습니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
```

예시는 `.env.example` 파일을 참고하면 됩니다.

## Supabase 적용 순서

Supabase SQL Editor에서 아래 순서대로 실행합니다.

1. `supabase/schema.sql`
2. `supabase/seed.sql`

mock 데이터가 바뀌면 아래 명령으로 시드 파일을 다시 만들 수 있습니다.

```bash
npm run db:seed:generate
```

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드와 배포 메모

로컬 개발과 프로덕션 빌드가 같은 출력 디렉터리를 공유하면 Next.js 충돌이 날 수 있기 때문에 현재는 아래처럼 분리되어 있습니다.

- `next dev`는 `.next` 사용
- 로컬 `build`와 `start`는 `.next-build` 사용
- Vercel 배포 시에는 기본 `.next` 사용

이 동작은 `scripts/run-build.mjs`에서 처리합니다.

## 기술 스택

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase JavaScript SDK

## 문서 원칙

- 저장소 문서는 실제 구현 상태를 기준으로 유지합니다.
- 더 이상 UI에 없는 기획 표현은 문서에서도 제거합니다.
- 비밀번호, secret key, service role key 같은 민감 정보는 저장소에 커밋하지 않습니다.
