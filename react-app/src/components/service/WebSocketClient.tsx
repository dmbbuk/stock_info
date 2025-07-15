// // components/WebSocketClient.tsx
// import { useEffect, useRef } from 'react';

// const WebSocketClient = () => {
//   const ws = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     // WebSocket 서버 호출을 먼저 트리거
//     fetch('/api/socket');

//     const socket = new WebSocket('ws://localhost:3000/api/socket');
//     ws.current = socket;

//     socket.onopen = () => {
//       console.log('WebSocket connected');
//       socket.send('Hello from React!');
//     };

//     socket.onmessage = (event) => {
//       console.log('Message from server:', event.data);
//     };

//     socket.onclose = () => {
//       console.log('WebSocket disconnected');
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   return <div>📡 WebSocket 연결 중... 콘솔을 확인하세요!</div>;
// };

// export default WebSocketClient;
