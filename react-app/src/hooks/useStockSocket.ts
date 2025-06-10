import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  simulateWebSocketConnection,
  mockEODHDWebSocketMessage,
  subscribeToSymbol,
} from "../mocks/websocketMock";

export type RealtimePrice = {
  price: number;
  timestamp: number;
};

export const useStockSocket = (watchedTickers: string[]) => {
  const socketRef = useRef<Socket | null>(null);
  const [latestPrices, setLatestPrices] = useState<
    Record<string, RealtimePrice>
  >({});
  const mockWebSocketEnabled = import.meta.env.VITE_MOCK_WEBSOCKET === "true";

  useEffect(() => {
    const mockIntervals: NodeJS.Timeout[] = [];

    if (mockWebSocketEnabled) {
      console.log("mockWebSocketEnabled");

      simulateWebSocketConnection();

      watchedTickers.forEach((ticker) => {
        // 수신 콜백 등록
        subscribeToSymbol(ticker, (data) => {
          setLatestPrices((prev) => ({
            ...prev,
            [ticker]: data,
          }));
        });

        // 주기적으로 mock 데이터 생성
        const interval = setInterval(() => {
          mockEODHDWebSocketMessage(ticker);
        }, 1000);

        mockIntervals.push(interval);
      });

      return () => {
        mockIntervals.forEach(clearInterval);
      };
    } else {
      const socket = io("http://localhost:3002");
      socketRef.current = socket;

      socket.emit("subscribe", watchedTickers);

      socket.on(
        "stock:data",
        ({
          ticker,
          data,
        }: {
          ticker: string;
          data: {
            p: RealtimePrice["price"];
            t: RealtimePrice["timestamp"];
          };
        }) => {
          setLatestPrices((prev) => ({
            ...prev,
            [ticker]: {
              price: data.p,
              timestamp: data.t,
            },
          }));
        }
      );

      return () => {
        socket.emit("unsubscribe", watchedTickers);
        socket.disconnect();
      };
    }
  }, [watchedTickers, mockWebSocketEnabled]);

  return {
    latestPrices,
    subscribeTickers: (tickers: string[]) => {
      if (!mockWebSocketEnabled) {
        socketRef.current?.emit("subscribe", tickers);
      }
    },
    unsubscribeTickers: (tickers: string[]) => {
      if (!mockWebSocketEnabled) {
        socketRef.current?.emit("unsubscribe", tickers);
      }
    },
  };
};
