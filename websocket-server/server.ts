import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import {
  createEODHDWebSocket,
  closeEODHDSocket,
} from "./src/services/eodhdSocketManager.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // React 개발 서버
  })
);

const server = createServer(app); // express 기반 http 서버
const io = new Server(server, {
  cors: { origin: "*" }, // WebSocket용 CORS도 허용
});

// socket.id → Set of tickers, 클라이언트를 키로 티커 집합을 매핑
const clientTickers = new Map<string, Set<string>>();
// ticker → Set of socket ids, 티커를 키로 클라이언트 집합을 매핑
const tickerClients = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  console.log("[Socket.IO] Client connected:", socket.id);

  // subscribe 이벤트가 오면 연결
  socket.on("subscribe", (tickers: string[]) => {
    tickers.forEach((ticker) => {
      // EODHD에 연결 없으면 연결
      if (!tickerClients.has(ticker)) {
        tickerClients.set(ticker, new Set());
        createEODHDWebSocket(ticker, (data) => {
          // 실제로 데이터 수신되면 이 안이 실행됨
          io.to(ticker).emit("stock:data", { ticker, data });
        });
      }

      tickerClients.get(ticker)!.add(socket.id);
      socket.join(ticker);

      if (!clientTickers.has(socket.id)) {
        clientTickers.set(socket.id, new Set());
      }
      clientTickers.get(socket.id)!.add(ticker);
    });
  });

  socket.on("unsubscribe", (tickers: string[]) => {
    tickers.forEach((ticker) => {
      tickerClients.get(ticker)?.delete(socket.id);
      socket.leave(ticker);

      if (tickerClients.get(ticker)?.size === 0) {
        tickerClients.delete(ticker);
        closeEODHDSocket(ticker);
      }

      clientTickers.get(socket.id)?.delete(ticker);
    });
  });

  // 해당 클라이언트의 소켓id로 티커들을 get함(하나의 socket.id로 모든 티커가 취득이 가능한가?)
  // 그 클라이언트의 티커들을 순회하면서 ticker의 client id들을 삭제
  // 해당 socket의 사이즈 0이라면 socket을 닫음
  // 클라이언트에서 해당 소켓을 삭제함함
  socket.on("disconnect", () => {
    const tickers = clientTickers.get(socket.id) || new Set();
    tickers.forEach((ticker) => {
      tickerClients.get(ticker)?.delete(socket.id);
      if (tickerClients.get(ticker)?.size === 0) {
        tickerClients.delete(ticker);
        closeEODHDSocket(ticker);
      }
    });
    clientTickers.delete(socket.id);
    console.log("[Socket.IO] Client disconnected:", socket.id);
  });
});

server.listen(Number(process.env.PORT || 3002), () => {
  console.log(`✅ WebSocket & REST server running on http://localhost:3002`);
});
