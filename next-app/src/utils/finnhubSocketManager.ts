// src/utils/finnhubSocketManager.ts
import WebSocket from 'ws';

export interface FinnhubMessage {
  type: string;
  data?: any;
}

type OnDataCallback = (data: FinnhubMessage) => void;

let finnhubSocket: WebSocket | null = null;
let clientCount = 0;
const subscribers = new Set<OnDataCallback>();

export const addClient = (onData: OnDataCallback) => {
  clientCount++;
  console.log('addClient clientCount:', clientCount);
  subscribers.add(onData);

  if (!finnhubSocket) {
    connectToFinnhub();
  }
};

export const removeClient = (onData: OnDataCallback) => {
  clientCount--;
  console.log('removeClient clientCount:', clientCount);
  subscribers.delete(onData);
  if (clientCount <= 0) {
    disconnectFromFinnhub();
  }
};

const connectToFinnhub = () => {
  const API_KEY = 'cu69ebpr01qujm3q44fgcu69ebpr01qujm3q44g0';
  const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
  finnhubSocket = socket;

  socket.on('open', () => {
    console.log('[Finnhub] Connected');
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:BTCUSDT' }));
  });

  socket.on('message', (data) => {
    const message: FinnhubMessage = JSON.parse(data.toString());
    for (const callback of subscribers) {
      callback(message);
    }
  });

  socket.on('error', (err) => {
    console.error('[Finnhub] Error:', err);
  });

  socket.on('close', () => {
    console.log('[Finnhub] Disconnected');
    finnhubSocket = null;
  });
};

const disconnectFromFinnhub = () => {
  if (finnhubSocket) {
    console.log('[Finnhub] Closing connection (no clients)');
    finnhubSocket.close();
    finnhubSocket = null;
  }
};