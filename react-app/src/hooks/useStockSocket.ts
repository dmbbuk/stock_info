// useStockSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useStockSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('finnhub-data', (data) => {
      console.log('📈 Real-time data from Finnhub:', data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
};

export default useStockSocket;
