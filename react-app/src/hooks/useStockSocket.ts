// useStockSocket.ts
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type RawSocketMessage = {
  data: {
    c: string[] | null; // 거래 조건
    s: string; // 티커, 종목
    t: number; // Timestamp
    v: number; // 거래 수량
    p: number; // 거래 가격
  }[];
  type: string; // 데이터 메세지 타입
};

type Trade = {
  s: string; // 티커
  p: number; // 가격
  v: number; // 수량
  t: number; // 타임스탬프
};

const useStockSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [latestTrades, setLatestTrades] = useState<Record<string, Trade>>({});
  // const [stocks, setStocks] = useState<RawSocketMessage[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("finnhub-data", (data: RawSocketMessage) => {
      console.log("data", data);
      if (data.type !== "trade") return;
      setLatestTrades((prev) => {
        let changed = false;
        const updated = { ...prev };

        for (const trade of data.data) {
          const prevTrade = prev[trade.s];
          // 이전 거래가 존재하지 않거나, 거래의 값이 하나라도 다를 경우(가격, 수량, 시간) 다른 거래로 취급함함
          const isChanged =
            !prevTrade ||
            prevTrade.p !== trade.p ||
            prevTrade.v !== trade.v ||
            prevTrade.t !== trade.t;

          if (isChanged) {
            updated[trade.s] = trade;
            changed = true;
          }
        }

        return changed ? updated : prev; // 값이 바뀌지 않았다면 이전 상태 그대로 반환
      });
    });

    // socket.on("finnhub-data", (data) => {
    //   console.log("📈 Real-time data from Finnhub:", data);
    //   setStocks((prev) => [data, ...prev.slice(0, 19)]); // 최신 20개 유지
    // });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return latestTrades;
};

export default useStockSocket;
