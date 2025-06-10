// websocket-server/eodhdSocketManager.ts
import WebSocket from "ws";
import * as dotenv from "dotenv";

dotenv.config();

type CallbackFn = (data: any) => void;

let socket: WebSocket | null = null;
let isSocketOpen = false;

const listeners: Record<string, CallbackFn[]> = {};
const subscribedSymbols = new Set<string>();

const apiKey = process.env.EODHD_API_KEY!;

const subscribeSymbols = (symbols: string[]) => {
  if (!socket || !isSocketOpen || symbols.length === 0) return;

  const symbolsToSubscribe = symbols.filter((s) => !subscribedSymbols.has(s));
  if (symbolsToSubscribe.length === 0) return;

  symbolsToSubscribe.forEach((s) => subscribedSymbols.add(s));

  socket.send(
    JSON.stringify({
      action: "subscribe",
      symbols: symbolsToSubscribe.join(","),
    })
  );
};

const unsubscribeSymbols = (symbols: string[]) => {
  if (!socket || !isSocketOpen || symbols.length === 0) return;

  const validSymbols = symbols.filter((s) => subscribedSymbols.has(s));
  if (validSymbols.length === 0) return;

  validSymbols.forEach((s) => subscribedSymbols.delete(s));

  socket.send(
    JSON.stringify({
      action: "unsubscribe",
      symbols: validSymbols.join(","),
    })
  );
};

export const createEODHDWebSocket = (symbol: string, onMessage: CallbackFn) => {
  if (!listeners[symbol]) {
    listeners[symbol] = [];
  }
  listeners[symbol].push(onMessage);

  // 소켓이 이미 연결되어 있다면 구독만 보냄
  if (socket && isSocketOpen) {
    subscribeSymbols([symbol]);
    return;
  }

  // 최초 연결
  socket = new WebSocket(
    `wss://ws.eodhistoricaldata.com/ws/us?api_token=${apiKey}`
  );

  socket.onopen = () => {
    console.log("WebSocket opened");
    isSocketOpen = true;
    // 기존 등록된 symbol을 subscribe
    subscribeSymbols(Object.keys(listeners));
  };

  socket.onmessage = (event: any) => {
    const parsed = JSON.parse(event.data);
    const symbol = parsed.s;
    if (listeners[symbol]) {
      listeners[symbol].forEach((cb) => cb(parsed));
    }
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
    isSocketOpen = false;
    socket = null;
  };

  socket.onerror = (err: any) => {
    console.error("[EODHD WS] Error:", err);
  };
};

export const closeEODHDSocket = (symbol: string) => {
  if (listeners[symbol]) {
    delete listeners[symbol];
    unsubscribeSymbols([symbol]);
  }
};
