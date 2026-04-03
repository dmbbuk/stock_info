# STOCK_INFO — Project Context for Claude

이 파일은 Claude Code가 어느 계정에서 열어도 동일한 컨텍스트로 작업할 수 있도록 git에 포함되는 프로젝트 전용 설정 파일입니다.

**세션 시작 시 반드시 할 것:**
1. 이 파일 전체 읽기
2. `TODO.md` 읽기
3. 현재 우선순위 섹션 확인 후 작업 시작

**세션 종료(작업 완료) 시 반드시 할 것:**
1. 이 파일의 "현재 구현 상태"와 "현재 우선순위" 섹션 업데이트
2. git 커밋에 포함

---

## 행동 원칙

- 아부성 표현 금지 ("좋은 질문이에요" 등 사용하지 않음)
- 답변 전 팩트체크 필수, 불확실하면 명시
- 설명 시 항상 실무 예시 포함 (API면 실제 request/response 값까지)
- 답변 후 예상 꼬리 질문 1~3개 선제 제안
- 추측으로 코드 짜지 않기 — 모르면 먼저 질문
- 파일 수정 전 계획 설명하고 승인 받은 후 실행
- 한 번에 작게 변경, diff 형식으로 제시
- 커밋 메시지는 영어로
- 기본 응답 언어는 한국어

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
GET /api/stocks/full-list          # 전체 종목 목록
GET /api/stocks/fundamentals?symbol=AAPL  # 펀더멘탈 데이터
GET /api/stocks/close-prices       # 종가 데이터
GET /api/stocks/recommendations    # 추천
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
