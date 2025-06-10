# stock_info

주식의 정보를 한 페이지에 표시해주는 웹 어플리케이션

design
shadcn/ui

TODO

1. 메뉴쪽 다국어화 설정 i18n 사용?
2. 모든 주식의 정보를 가져오기
3. 웹소켓을 사용해서 접속한채로 실시간 데이터를 받아올 수 있음, 하지만 모든 데이터를 한번에 가져오려면 어떻게 해야할까? 우선순위에 따라서 나누어야 할까? 설계 고민...
4.

[사용자 브라우저]
│
▼
React (localhost:3000) ────▶ WebSocket (EC2:3001)
│ ▲
▼ │
Next.js API Routes (Vercel or Lambda) ◀── REST (펀더멘털, 감시리스트)

[Frontend (React SPA)]
↕ socket.io (실시간)
↕ REST (지표조회)

[Next.js API 서버]
↕ REST API (지표 Fetch)
⟳ 주기적 백그라운드 fetch & 캐싱 (예: Redis, DB)
↕ EODHD (REST API 사용, 하루 1회)

[WebSocket 중계 서버]
↕ socket.io
↔ EODHD WebSocket (실시간 가격)

4. 디자인
   ✨ 차선 제안 (더 미니멀하게)
   기본은 테이블만 제공

“내 종목 요약 보기”는 카드 UI로 제공하되, Top 3~5 종목만 요약 (예: 홈 위젯처럼)

카드 뷰는 “추후 확장 기능”으로 자연스럽게 추가
