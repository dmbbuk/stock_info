# STOCK_INFO — Project Context for Claude

이 파일은 Claude Code가 어느 계정에서 열어도 동일한 컨텍스트로 작업할 수 있도록 git에 포함되는 프로젝트 전용 설정 파일입니다.

> ⚠️ **Claude에게**: 이 파일을 읽었으면 즉시 `TODO.md`를 Read 툴로 읽어라.  
> 그 후 사용자에게 "오늘 우선순위는 N번입니다. 작업할까요?" 라고 보고하는 것이 **모든 세션의 첫 번째 행동**이다.  
> `To_claude_code.txt`는 이 파일에 통합 완료 — 별도로 읽지 않아도 된다.

**세션 시작 시 반드시 할 것:**
1. 이 파일 전체 읽기 (시스템에서 자동 로드됨)
2. `TODO.md` Read 툴로 읽기 → 현재 우선순위 파악
3. 사용자에게 현재 우선순위 보고 후 작업 시작

**세션 종료(작업 완료) 시 반드시 할 것:**
1. 이 파일의 "현재 구현 상태"와 "현재 우선순위" 섹션 업데이트
2. "세션 회의록" 섹션에 오늘 작업 내용 요약 추가 (다른 계정 연계 목적)
3. git 커밋에 포함

---

## 행동 원칙

- **아부 금지** — "좋은 질문이에요", "훌륭해요" 같은 의미 없는 긍정 표현 사용하지 않음
- **팩트체크 필수** — 답변 전에 불확실한 내용은 반드시 확인하고, 확실하지 않으면 명시
- **인터넷 여론 수집** — 관련 질문 시 웹 검색으로 리뷰/댓글/의견 수집 후 종합해서 제시
- **선제적 꼬리 질문 제안** — 답변 후 사용자가 궁금해할 만한 다음 질문을 먼저 제시

---

## 응답 언어 및 스타일

- 기본 응답 언어는 **한국어**
- 일본어 회사 근무로 일본어가 섞일 수 있음 — 일본어가 섞여있어도 **반드시** 한국어로 답변
- 사용자가 일본어 교정을 명시적으로 요청할 때만 일본어 교정/피드백 제공
- 설명 시 항상 **실무 예시** 포함 — API 설명이라면 실제 request 값, response 값까지 구체적으로 제시
  - 예: `POST /api/login` → request body `{ "email": "test@test.com", "password": "1234" }` → response `{ "token": "eyJ..." }`
- 추상적 설명보다 **구체적인 코드/데이터 예시** 우선

---

## 작업 방식 및 협업 규칙

- **추측으로 코드 짜지 않기** — 모르거나 불확실하면 먼저 질문
- **작게 나눠서 변경** — 한 번에 너무 많이 바꾸지 않고 단계적으로
- **사전 승인 필수** — 파일 수정 전 계획을 먼저 설명하고 OK 받은 후 실행
- **diff 형식으로 변경 사항 제시** — 코드 변경 시 무엇이 바뀌는지 명확히 보여줌
- **테스트 코드 함께 작성** — 기능 구현 시 `test/` 폴더에 테스트 코드도 같이 작성
  - 현재 테스트 환경 미구축 상태이므로 `test/` 폴더 기준으로 점진적 구축
- **커밋 메시지는 영어로**

---

## 코딩 스타일 및 프로젝트 성격

- 기본적으로 **일반적이고 표준적인 구조** 사용
- 때때로 최신 트렌드/패턴 도전 요청할 수 있음 — 요청 시 적극적으로 제안
- 현재 작업 중인 프로젝트는 **개인 토이 프로젝트** (회사 업무 아님)
  - 실험적 시도, 새로운 기술 도입에 유연하게 접근
  - 장기적으로 소액 수익화도 목표

---

## 코드 리뷰 기준

> 출처: Google Eng Practices, Clean Code (R. Martin), OWASP Code Review Guide v2.0, Martin Fowler Refactoring

### 리뷰 우선순위

| 레벨 | 설명 | 예시 |
|------|------|------|
| **MUST** | 보안, 데이터 손실, 크래시 | API 키 노출, null 접근 크래시 |
| **SHOULD** | 성능, 타입 안전성, 테스트 누락 | any 타입, 메모이제이션 누락 |
| **CONSIDER** | 가독성, 리팩터링 제안 | 함수 분리, 명명 개선 |
| **NIT** | 스타일, 취향 | 공백, 포맷팅 |

### 체크리스트

**설계 (Design)**
- 변경 단위가 하나의 명확한 목적을 가지고 있는가?
- SRP: 함수/컴포넌트가 한 가지 일만 하는가?
- OCP: 기능 확장 시 기존 코드를 수정하지 않아도 되는가?
- DIP: 구체 구현이 아닌 인터페이스에 의존하는가?

**기능 정확성 (Correctness)**
- 엣지 케이스(빈 배열, null, 0, 음수) 처리 여부
- 비동기 처리에서 에러 핸들링 누락 없는가?
- 로딩/에러/빈 상태 UI가 모두 처리되어 있는가?

**복잡도 (Complexity)**
- 함수/컴포넌트가 20줄 이내인가?
- 중첩 if/삼항연산자 3단계 이하인가?
- 매직 넘버 대신 명명된 상수를 사용하는가?

**명명 (Naming)**
- 변수/함수명이 목적을 드러내는가? (`data` X → `stockFundamentals` O)
- 불리언 변수에 `is`, `has`, `can` 접두사 사용하는가?
- 이벤트 핸들러에 `handle` 접두사 사용하는가?

**타입 안전성 (TypeScript)**
- `any` 타입 사용을 피하고 구체적인 타입을 정의했는가?
- `undefined`/`null` 가능성에 옵셔널 체이닝(`?.`) 사용하는가?

**성능 (Performance)**
- 불필요한 리렌더링 유발하는 인라인 객체/함수 없는가?
- API 호출 중복 방지를 위한 캐싱이 적용되어 있는가?
- 무거운 연산이 메모이제이션 되어 있는가?

**보안 (Security) — MUST**
- API 키/시크릿이 클라이언트 코드나 Git에 노출되지 않는가?
- 외부 입력값을 검증 없이 사용하지 않는가?
- 에러 메시지에 내부 스택 트레이스가 노출되지 않는가?

**테스트 (Tests)**
- 핵심 비즈니스 로직에 단위 테스트가 있는가?
- 엣지 케이스가 테스트 케이스에 포함되어 있는가?

**가독성/유지보수성**
- 중복 코드가 없는가? (DRY)
- 컴포넌트 파일이 300줄을 초과한다면 분리를 검토했는가?
- `TODO`/`FIXME` 주석에 담당자와 이슈 링크가 있는가?

---

## 사용자 정보

- 개발 경험: 8년
- 주요 기술 스택: Java, JavaScript, Vue.js, Node.js (프론트엔드 + 백엔드 풀스택)
- 코드 가독성이 높아 Python 등 다른 언어도 어느 정도 이해 가능
- 현재 역할: 개발 리더 (향후 역할 변화 가능성 있음)

---

## 필수 참조 파일

- `TODO.md` — 현재 작업 우선순위 (매 세션 시작 시 반드시 읽을 것)
- `To_claude_code.txt` — 프로젝트 전체 소개 원본 (이미 이 파일에 통합됨, 별도 읽기 불필요)

---

## 프로젝트 개요

**STOCK_INFO** — React + Next.js 기반 미국 주식 펀더멘털 스크리너

- 실시간 트레이딩 UI가 아님 — 펀더멘털 기반 종목 분석/스크리닝 플랫폼
- 대상 사용자: 개인 투자자 (리테일)
- 목표: 종목을 빠르게 비교/필터링/평가할 수 있는 UI
- 개인 토이 프로젝트, 소액 수익화 목표

---

## 아키텍처

```
stock_info/
 ├─ next-app/      # 백엔드 — Next.js API Routes
 ├─ react-app/     # 프론트엔드 — React + TypeScript + Vite
 └─ shared-types/  # 공유 타입 정의
```

**프론트엔드:** React + TypeScript + Vite + shadcn/ui (Tailwind + Radix UI)  
**백엔드:** Next.js API Routes  
**데이터 소스:** EODHD API  
**공유 타입:** `shared-types/src/` — eodhdTypes, FilterSetTypes, fundamentalTypes

---

## 실제 API 엔드포인트

```
GET /api/stocks/full-list                    # 전체 종목 목록
GET /api/stocks/fundamentals?symbol=AAPL     # 펀더멘탈 데이터
GET /api/stocks/close-prices                 # 종가 데이터
GET /api/stocks/recommendations              # 추천
```

> ⚠️ 프로젝트 문서(To_claude_code.txt)에 `/api/stocks/hot-tickers`로 기재되어 있으나 실제로는 `full-list`임

---

## 현재 구현 상태

| 기능 | 상태 |
|------|------|
| 펀더멘털 테이블 | 구현됨 (StockDataTable.tsx, StockTableColumns.tsx) |
| 필터 시스템 | 구현됨 (FundamentalFilter.tsx, filterEngine.tsx) |
| 유명 투자자 필터 탭 | 구현됨 (PredefinedFilterTabs.tsx) — 고도화 필요 |
| UI 디자인 | Finviz 스타일로 전면 리뉴얼 완료 (2026-04-09) |
| 뷰 탭 | 구현됨 — Overview / Valuation / Financial / Technical / Custom |
| 인라인 필터 그리드 | 구현됨 — 패널/오버레이 제거, 항상 노출 |
| WebSocket | 코드 잔존하나 비활성 (현재 방향 아님) |
| 테스트 환경 | 미구축 — test/ 폴더에 점진적 구축 예정 |
| Mock 데이터 | 구비됨 (10,000개 종목 JSON) |
| Python 수집 스크립트 | fetch_all.py 작성 완료 (2026-04-13) — API 플랜 제한으로 실데이터 미수집 |
| AWS S3 | 버킷 생성 완료 (stock-info-data), 업로드 테스트 성공 |
| 루트 .gitignore | 생성 완료 (scripts/.env, output/ 제외) |

---

## 주요 컴포넌트

```
react-app/src/
 ├─ pages/
 │   ├─ Home.tsx                 # 메인 진입점
 │   ├─ StockTable.tsx           # 핵심 테이블 뷰
 │   ├─ FundamentalFilter.tsx    # 필터 UI
 │   ├─ FundamentalSettings.tsx  # 지표 선택 UI
 │   ├─ PredefinedFilterTabs.tsx # 유명 투자자 필터 탭
 │   └─ SearchBar.tsx
 └─ components/
     ├─ StockDataTable.tsx
     └─ StockTableColumns.tsx
```

---

## 현재 우선순위 (TODO.md 기준)

1. **[블로커] 데이터 API 결정: EODHD 유료 vs FMP** — 현재 EODHD 무료 키로는 펀더멘탈/종가 403/423 에러
2. API 결정 후 fetch_all.py 수정 + 실데이터 수집 테스트
3. GitHub Actions cron 스케줄러 설정
4. 프론트 fetch URL → S3로 교체 (fundamentalsFetcher.tsx)
5. Next.js 백엔드(next-app/) 삭제

---

## 제품 차별화 아이디어 (To_claude_code.txt에서 통합)

단순 숫자 나열이 아닌, 리테일 투자자가 이해하기 쉬운 UI가 목표.

### 1. 한 줄 종목 요약 카드
"이 종목은 한 문장으로 무엇인가?" 개념. 재무 프로파일 기반 자동 생성.
- 예: `"수익성 높은 대형 기술주, 적정 밸류에이션, 강한 마진"`
- 예: `"고성장이지만 고평가, 배당 매력 낮음"`

### 2. 투자 체크리스트 UI
종목이 특정 조건을 통과하는지 시각화.
- 수익성 / 성장성 / 밸류에이션 / 부채 안전성 / 배당 품질
- 표시 방식: 별점, pass/fail 뱃지, 체크리스트 행, 카테고리 점수 요약

### 3. 카드뷰 옵션
테이블 뷰 외에 카드 형태의 뷰 추가 예정.

### 4. 목업 포트폴리오 / 관심종목 추적
- 선택 종목 추적, 수익 시뮬레이션, 그룹별 성과 비교
- 실제 매매 없이 아이디어 모니터링
- 계획 단계, 현재 메인 포커스 아님

### 5. 기본 정렬
초기 로딩 시 PER 오름차순 정렬 등 기본값 설정 예정.

---

## 중요 결정사항 / 컨텍스트

- WebSocket 기능은 코드가 남아있지만 현재 방향 아님 — 삭제 or 유지 미결정
- **[확정] 아키텍처 방향: 배치 수집 + S3 캐싱 + 프론트 직접 fetch**
  - 장 종료 후 1회 Python 스크립트 실행 → EODHD API 호출 → JSON.gz S3 업로드
  - React SPA가 S3 URL에서 직접 fetch → 클라이언트 필터링 (현재 구조 그대로)
  - 이 구조면 Next.js 백엔드(next-app/) 불필요 — 삭제 여부 미결정
- **[블로커] 데이터 API: EODHD(현재) vs FMP(Financial Modeling Prep)** — EODHD 무료 키로 fundamentals 403, bulk EOD 423 확인됨. 유료 전환($19.99/월~) 또는 FMP 전환 필요
- **[미결] 배치 스케줄러: GitHub Actions cron vs AWS Lambda+EventBridge** — 미결정
- 스크리너는 리얼타임 데이터 불필요 (Finviz Free도 15분 지연, 펀더멘털은 분기 단위)
- UI 디자인: Finviz 스타일로 완료 — DaisyUI/NextUI 전환 검토 보류
- 빨강/파랑 색상 테마 국제화 옵션 (미국식 vs 한국식) 나중에 고려
- PRO Mode 아이디어 존재 (추가 필터, 직접 입력, 즐겨찾기)

---

## 세션 회의록

> 각 세션 종료 시 Claude가 작성. 다른 계정과의 컨텍스트 연계 목적.  
> 형식: 날짜 / 작업 내용 / 결정사항 / 미결사항

---

### 2026-04-09

**작업 내용:**
- Finviz(finviz.com/screener) 디자인 참고하여 UI 전면 리뉴얼
  - `App.tsx`: 배경 `#0d0d0d`, 레이아웃 패딩 축소
  - `Header.tsx`: 슬림 네비 바 (h-11) — STOCKSCREENER 로고 + 검색창만
  - `SearchBar.tsx`: 네비 바용 compact 스타일
  - `FundamentalFilter.tsx`: `compact` prop 추가 — 패널 오버레이 제거, 인라인 드롭다운 그리드로 전환
  - `StockTable.tsx`: 전면 재구성 — 뷰탭(Overview/Valuation/Financial/Technical/Custom) 도입, 필터 상시 노출
  - `StockDataTable.tsx`: 행 높이 40→32px, zebra striping, text-xs, compact 페이지네이션
  - `PredefinedFilterTabs.tsx`: 프리셋 버튼 이모지 전부 제거
  - `StockTableColumns.tsx`: `rightAlign`에 `w-full` 추가 → 헤더/값 정렬 불일치 버그 수정

**결정사항:**
- 스크리너는 리얼타임 데이터 불필요 — 배치(1일 1회) 충분
- 아키텍처 확정: 배치 수집 → S3 업로드 → 프론트 직접 fetch (Next.js 백엔드 불필요 방향)
- UI 기준 레퍼런스: Finviz 스타일로 확정

**미결사항:**
- 데이터 API 최종 선택: EODHD vs FMP
- 배치 스케줄러: GitHub Actions cron vs AWS Lambda+EventBridge
- Next.js 백엔드(`next-app/`) 삭제 여부

---

### 2026-04-13

**작업 내용:**
- AWS 가입 (Free 플랜) + 보안 설정 가이드 (MFA, Budget Alert $1, IAM 분리)
- S3 버킷 생성 완료 (`stock-info-data`, us-east-1)
  - 퍼블릭 읽기 허용 (Bucket Policy)
  - CORS 설정 (localhost:5173 허용)
  - IAM 유저 `stock-info-uploader` (S3 PutObject만 허용)
- `scripts/fetch_all.py` 신규 작성 — EODHD 기반 3종 데이터 수집 스크립트
  - 티커 목록 / 펀더멘탈 / 종가 수집 → gzip → S3 업로드
  - `--local`, `--limit N`, `--tickers-only` 플래그 지원
  - `fundamentals.ts`의 변환 로직을 Python으로 복제 (FundamentalData 호환)
- `scripts/requirements.txt` 생성 (requests, boto3, python-dotenv)
- `scripts/.env.example` + `scripts/.env` 생성
- 루트 `.gitignore` 생성 (scripts/.env, output/ 제외)
- 로컬 테스트 실행:
  - 티커 목록: 성공 (18,915개 Common Stock, 2.5MB → 0.3MB gzip)
  - 펀더멘탈: **403 Forbidden** (EODHD 무료 플랜 제한)
  - 종가 Bulk: **423 Locked** (EODHD 무료 플랜 제한)
- S3 업로드 테스트: **성공** (test.json.gz 업로드 + 퍼블릭 URL 접근 확인)

**결정사항:**
- AWS Free 플랜으로 진행
- S3 버킷명: `stock-info-data`
- S3 파일 구조: `data/latest/*.json.gz` (프론트용) + `data/{날짜}/*.json.gz` (아카이브)

**미결사항 (다음 세션 블로커):**
- **데이터 API 최종 결정** — EODHD 유료($19.99/월~) vs FMP($14/월~) vs 기타
  - EODHD 무료로는 펀더멘탈/종가 접근 불가 확인됨
  - 이 결정 없이는 파이프라인 완성 불가
- API 결정 후 fetch_all.py 엔드포인트/파싱 수정
- AWS Secret Key가 채팅 로그에 노출됨 — IAM 키 로테이션 권장
