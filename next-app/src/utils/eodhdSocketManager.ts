// // src/utils/eodhdSocketManager.ts
// import WebSocket from "ws";

// export interface EodhdMessage {
//   s: string; // 심볼
//   t: number; // 타임스탬프 (ms)
//   c: number; // 종가 (현재가)
//   v: number; // 거래량
// }

// type OnDataCallback = (data: EodhdMessage) => void;

// let eodhdSocket: WebSocket | null = null;
// let clientCount = 0;
// const subscribers = new Set<OnDataCallback>();
// const subscribedSymbols = ["AAPL.US", "MSFT.US", "TSLA.US"]; // 원하는 티커

// export const addClient = (onData: OnDataCallback) => {
//   clientCount++;
//   console.log("addClient clientCount:", clientCount);
//   subscribers.add(onData);

//   if (!eodhdSocket) {
//     connectToEodhd();
//   }
// };

// export const removeClient = (onData: OnDataCallback) => {
//   clientCount--;
//   console.log("removeClient clientCount:", clientCount);
//   subscribers.delete(onData);

//   if (clientCount <= 0) {
//     disconnectFromEodhd();
//   }
// };

// const connectToEodhd = () => {
//   const socket = new WebSocket("wss://ws.eodhd.com/ws");
//   eodhdSocket = socket;

//   socket.on("open", () => {
//     console.log("[EODHD] Connected");

//     socket.send(
//       JSON.stringify({
//         action: "subscribe",
//         symbols: subscribedSymbols,
//       })
//     );
//   });

//   socket.on("message", (data) => {
//     try {
//       const message = JSON.parse(data.toString());

//       // EODHD는 메시지가 여러 형식일 수 있음. "c" 값이 있으면 실시간 가격으로 간주
//       if (message.c && message.s) {
//         const normalized: EodhdMessage = {
//           s: message.s,
//           t: message.t,
//           c: message.c,
//           v: message.v,
//         };

//         for (const callback of subscribers) {
//           callback(normalized);
//         }
//       }
//     } catch (e) {
//       console.error("[EODHD] Failed to parse message", e);
//     }
//   });

//   socket.on("error", (err) => {
//     console.error("[EODHD] Error:", err);
//   });

//   socket.on("close", () => {
//     console.log("[EODHD] Disconnected");
//     eodhdSocket = null;
//   });
// };

// const disconnectFromEodhd = () => {
//   if (eodhdSocket) {
//     console.log("[EODHD] Closing connection (no clients)");
//     eodhdSocket.close();
//     eodhdSocket = null;
//   }
// };
