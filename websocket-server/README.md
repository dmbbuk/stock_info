### 📘 EODHD WebSocket 흐름 요약 (2025-06 기준)

실시간 가격을 확인하기 위한 웹소켓 서버

---

## 1. React 컴포넌트 `StockTable.tsx`

- `hotTickers` 배열을 기준으로 WebSocket 실시간 가격 + REST 펀더멘털 데이터를 병행 요청
- `useStockSocket(hotTickers)` 훅으로 가격 수신
- `fetchFundamentalsFor(hotTickers)` 함수로 펀더멘털 데이터 fetch 후 state 저장

---

## 2. 클라이언트용 WebSocket 훅 `useStockSocket.ts`

- 서버(`ws://localhost:3002`)에 연결하고, `subscribe`로 티커 리스트 전송
- 서버로부터 수신 시
  ```ts
  socket.on("stock:data", { ticker, data });
  ```
  → `setLatestPrices`로 상태 업데이트
- 컴포넌트 mount 시 `subscribe`, unmount 시 `unsubscribe` emit 수행

---

## 3. WebSocket 서버 `server.ts`

- 클라이언트별로 **socket.id → Set<ticker>** 매핑
- 종목별로 **ticker → Set<socket.id>** 매핑
- `subscribe` 시:
  - 종목에 대해 처음이라면 EODHD WebSocket 연결 생성 (`createEODHDWebSocket` 호출)
  - 이후 해당 클라이언트를 `ticker` 방에 join
- EODHD에서 데이터 수신되면:
  - `io.to(ticker).emit("stock:data", { ticker, data })`로 방송
- disconnect 시 클라이언트가 구독 중이던 종목들 정리

---

## 4. 서드파티와 연결 담당 `eodhdSocketManager.ts`

- 단일 WebSocket을 생성하여 다중 심볼 처리
- `listeners[symbol]`: 콜백 배열 → 심볼별로 수신 시 실행할 함수들 저장
- `subscribeSymbols([...])`:
  - 아직 구독 안된 symbol들만 필터링
  - `symbols: "AAPL,AMZN"` 식으로 join하여 전송
    - 일반적으로는 하나씩 보낼 예정이지만, 사이트에 구조에 따라서 join으로 보낼 수 있음(1페이지에 20개 구독이 필요하므로, 20개 단위로 구독리스트가 오면 구독한다던가.)
- WebSocket `onmessage` 수신 시
  - `parsed.s` 값 기준으로 해당 콜백들 실행
- 연결 초기에는 `Object.keys(listeners)` 전체에 대해 subscribe
- `closeEODHDSocket(symbol)` 호출되면 해당 symbol만 unsubscribe 수행

---

✅ 정리: 하나의 WebSocket으로 여러 종목을 관리하며,
클라이언트는 티커를 선택해 구독/해지 가능. 서버는 `join`과 `emit`을 활용해 효율적으로 브로드캐스트함.
