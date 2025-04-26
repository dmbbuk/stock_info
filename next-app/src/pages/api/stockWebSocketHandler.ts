import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import WebSocket from 'ws';
import { FinnhubMessage } from '@/app/type/type'
import getWebsocketFinnhubData from './getWebsocketFinnhubData';
import { Server as HttpServer } from 'http'; // HttpServer 가져오기


let clients: Set<WebSocket> = new Set();

interface ExtendedSocket extends NodeJS.Socket {
  server: HttpServer & { wss?: WebSocket.WebSocketServer }; // 서버 객체 타입 확장
  wss?: WebSocket.WebSocketServer; // WebSocket 서버를 저장할 수 있는 속성 추가
}

// CORS 미들웨어 초기화
// TODO: CORS관련해서 나중에 제대로 만들기
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: 'http://localhost:5173', // 허용할 도메인
});

const stockWebSocketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const socket = res.socket as unknown as ExtendedSocket;

  if (!res.socket) {
    console.error('res.socket is null. Cannot proceed with WebSocket setup.');
    res.status(500).end('Server Error: Unable to access socket.');
    return;
  }

  if (!socket.server.wss) {
    console.log('Initializing WebSocket server');

    const wss = new WebSocket.WebSocketServer({ noServer: true });

    // 외부 WebSocket 데이터를 브로드캐스트
    getWebsocketFinnhubData((data: FinnhubMessage) => {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    });

    wss.on('connection', (ws) => {
      console.log('Client connected');
      clients.add(ws);

      ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
      });
    });

    socket.server.wss = wss;
    console.log('WebSocket server initialized');
  }

  res.end();
};

export const config = {
  api: {
    bodyParser: false, // WebSocket 사용 시 bodyParser 비활성화
  },
};

export default stockWebSocketHandler;