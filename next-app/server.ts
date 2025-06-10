// // server.ts
// import next from "next";
// import { createServer } from "http";
// import { Server as SocketIOServer } from "socket.io";
// import { parse } from "url";
// import {
//   addClient,
//   removeClient,
//   EodhdMessage,
// } from "./src/utils/eodhdSocketManager"; // 변경

// const port = 3001;
// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req: any, res: any) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//     if (req.method === "OPTIONS") {
//       res.statusCode = 204;
//       res.end();
//       return;
//     }

//     const parsedUrl = parse(req.url || "", true);
//     handle(req, res, parsedUrl);
//   });

//   const io = new SocketIOServer(server, { cors: { origin: "*" } });

//   io.on("connection", (socket) => {
//     console.log("[Socket.IO] Client connected:", socket.id);

//     const onData = (data: EodhdMessage) => {
//       socket.emit("eodhd-data", data); // 이벤트 이름 변경
//     };

//     addClient(onData);

//     socket.on("disconnect", () => {
//       console.log("[Socket.IO] Client disconnected:", socket.id);
//       removeClient(onData);
//     });
//   });

//   server.listen(port, () => {
//     console.log(`> Ready on http://localhost:${port}`);
//   });
// });
