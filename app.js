// built-in modules
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// 현재 파일의 URL을 파일 경로로 변환
const __filename = fileURLToPath(import.meta.url);
// __filename에서 디렉토리 이름을 구함
const __dirname = dirname(__filename);

// not built-in modules
import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// cookie parser
import cookieParser from "cookie-parser";

// user-defined modules
import dotenv from "dotenv";
dotenv.config();

import { translateClientReq } from "./src/server/translate.js";
import { sessionMiddleware as sessionHandler } from "./src/server/sessionhandler.js";
import { errorController as errorHandler } from "./src/server/errorhandler.js";
import {
  handleClientMessage,
  userHistories,
} from "./src/server/clientMessageHandler.js";

//PORT
const PORT = process.env.PORT;

//미들웨어 사용
app.use(cookieParser()); //쿠키 파서 미들웨어
app.use(sessionHandler); //세션 미들웨어
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  //cors 허용
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// 웹소켓 연결 설정
io.on("connection", (socket) => {
  // 연결이 되었을 때
  console.log("새로운 클라이언트가 연결되었습니다.");

  socket.on("connectAiChat", () => {
    console.log("클라이언트가 AI 챗봇에 연결하였습니다");
    handleClientMessage(socket);
  });
  // 연결이 끊어졌을 때
  socket.on("disconnect", () => {
    console.log("클라이언트 연결이 끊어졌습니다.");
  });
});

//라우팅
app.get("/", (req, res) => {
  //index.html 보내기
  res.sendFile("index.html");
});

app.post("/translate", async (req, res) => {
  const data = req.body;
  try {
    const results = await translateClientReq(data, io);
    res.status(200).send("translation complete");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.get("/healthcheck", (req, res) => {
  res.status(200).send("ok");
});

app.use(errorHandler);

server.listen(PORT, () => console.log(`listening on port ${PORT}...`));
