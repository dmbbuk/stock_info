// // pages/api/socket.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { Server } from 'http';
// import WebSocket, { WebSocketServer } from 'ws';
// import getWebsocketFinnhubData from '../../utils/getWebsocketFinnhubData';
// import { FinnhubMessage } from '@/app/type/type';

// type NextApiResponseWithSocket = NextApiResponse & {
//   socket: {
//     server: Server & {
//       wss?: WebSocketServer;
//     };
//   };
// };

// const clients = new Set<WebSocket>();

// export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
//   // CORS 설정
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   if (!res.socket.server.wss) {
//     console.log('[INIT] Starting WebSocket server...');

//     const wss = new WebSocketServer({ noServer: true });

//     res.socket.server.on('upgrade', (req, socket, head) => {
//       if (req.url === '/api/socket') {
//         wss.handleUpgrade(req, socket, head, (ws) => {
//           wss.emit('connection', ws, req);
//         });
//       }
//     });

//     // Finnhub 데이터를 브로드캐스트
//     getWebsocketFinnhubData((data: FinnhubMessage) => {
//       const json = JSON.stringify(data);
//       clients.forEach((client) => {
//         console.log('client.readyState ', client.readyState );
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(json);
//         }
//       });
//     });

//     wss.on('connection', (ws) => {
//       clients.add(ws);
//       console.log('[WS] Client connected. Total:', clients.size);

//       ws.on('close', () => {
//         clients.delete(ws);
//         console.log('[WS] Client disconnected. Total:', clients.size);
//       });

//       // 최초 연결 시 단순 응답 메시지
//       ws.send('WebSocket connection established.');
//     });

//     res.socket.server.wss = wss;
//   }

//   res.end();
// }
