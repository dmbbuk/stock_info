import WebSocket from 'ws';
import { FinnhubMessage } from '@/app/type/type';

const getWebsocketFinnhubData = async (onData: (data: FinnhubMessage) => void) => {
  const API_KEY = 'cu69ebpr01qujm3q44fgcu69ebpr01qujm3q44g0'; // Finnhub API 키
  const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

  // WebSocket 연결 성공 시 실행
  socket.on('open', () => {
    console.log('Connected to Finnhub WebSocket');
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
    socket.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:BTCUSDT' }));
  });

  // 메시지 수신 시 실행
  socket.on('message', (data: WebSocket.Data) => {
    const message: FinnhubMessage = JSON.parse(data.toString());
    console.log('Received data:', message);

    // 데이터를 콜백으로 전달
    onData(message);
  });

  // WebSocket 연결 종료 시 실행
  socket.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // WebSocket 오류 발생 시 실행
  socket.on('error', (error: any) => {
    console.error('WebSocket error:', error);
  });
};

export default getWebsocketFinnhubData;