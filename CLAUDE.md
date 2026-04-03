# STOCK_INFO — Project Context for Claude

이 파일은 Claude Code가 어느 계정에서 열어도 동일한 컨텍스트로 작업할 수 있도록 git에 포함되는 프로젝트 전용 설정 파일입니다.

**세션 시작 시 반드시 할 것:**
1. 이 파일 전체 읽기
2. `To_claude_code.txt` 읽기 (처음 접하는 경우)
3. `TODO.md` 읽기
4. 현재 우선순위 섹션 확인 후 작업 시작

**세션 종료(작업 완료) 시 반드시 할 것:**
1. 이 파일의 "현재 구현 상태"와 "현재 우선순위" 섹션 업데이트
2. git 커밋에 포함

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

- `To_claude_code.txt` — 프로젝트 전체 소개 (처음 접하는 경우 반드시 읽을 것)
- `TODO.md` — 현재 작업 우선순위

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
| WebSocket | 코드 잔존하나 비활성 (현재 방향 아님) |
| 테스트 환경 | 미구축 — test/ 폴더에 점진적 구축 예정 |
| Mock 데이터 | 구비됨 (10,000개 종목 JSON) |
| Python 수집 스크립트 | scripts/fetch_tickers.py 존재 |

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

1. **[0순위]** 유명 투자자 필터 팩트체크 + Tooltip 설명 추가
2. 데이터 수집 서버 구축 (장 종료 후 EODHD → S3 저장)
3. Gzip 압축 전송 (10MB → ~2MB)
4. 비동기 fetch + 로딩 스켈레톤 UI
5. 테이블 우측 요약 컬럼

---

## 중요 결정사항 / 컨텍스트

- WebSocket 기능은 코드가 남아있지만 현재 방향 아님 — 삭제 or 유지 미결정
- 향후 S3에 JSON 캐싱 → 프론트가 직접 S3에서 fetch하는 구조 고려 중
- UI 라이브러리 변경 검토 중 (DaisyUI, NextUI 후보)
- 빨강/파랑 색상 테마 국제화 옵션 (미국식 vs 한국식) 나중에 고려
- PRO Mode 아이디어 존재 (추가 필터, 직접 입력, 즐겨찾기)
