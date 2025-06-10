export type RealtimePrice = {
  price: number;
  timestamp: number;
};

// 콜백 함수 타입 정의
type CallbackFn = (data: RealtimePrice) => void;

// 심볼별 리스너 목록
const listeners: Record<string, CallbackFn[]> = {};

// 모의 WebSocket 객체 및 상태
let socket: WebSocket | null = null;

/**
 * 모의 WebSocket 연결 생성
 */
export const simulateWebSocketConnection = () => {
  socket = {} as WebSocket; // 빈 객체를 WebSocket 타입처럼 강제 캐스팅

  socket.onmessage = (event: MessageEvent) => {
    console.log("Mock WebSocket message received:", event.data);
  };

  console.log("Mock WebSocket connected.");
};

/**
 * 특정 티커에 대한 콜백 등록
 */
export const subscribeToSymbol = (symbol: string, callback: CallbackFn) => {
  if (!listeners[symbol]) {
    listeners[symbol] = [];
  }
  listeners[symbol].push(callback);
  console.log(`Subscribed to mock data for ${symbol}`);
};

/**
 * 모의 WebSocket 메시지 전송 시뮬레이션
 */
export const mockEODHDWebSocketMessage = (symbol: string) => {
  const mockData: RealtimePrice = {
    price: +(100 + Math.random() * 50).toFixed(2), // 예: 100~150 사이의 랜덤 가격
    timestamp: Date.now(),
  };

  const mockMessage = JSON.stringify({
    s: symbol,
    p: mockData.price,
    t: mockData.timestamp,
  });

  // 리스너가 등록되어 있으면 호출
  if (listeners[symbol]?.length) {
    listeners[symbol].forEach((cb) => cb(mockData));
  }

  // 디버그용 출력
  console.log(`Mock data sent for ${symbol}:`, mockMessage);
};
