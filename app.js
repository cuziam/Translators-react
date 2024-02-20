// built-in modules
import path from "path";
import fs from "fs";
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

import { sessionMiddleware as sessionHandler } from "./src/server/sessionhandler.js";
import { errorController as errorHandler } from "./src/server/errorhandler.js";
import { handleClientMessage } from "./src/server/clientMessageHandler.js";
import { handleTtsRequest } from "./src/server/ttsRequetHandler.js";
import { handleTranslate } from "./src/server/translateHandler.js";
import { handleTranscript } from "./src/server/transcriptionHandler.js";
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
    handleTtsRequest(socket);
    handleTranslate(socket);
    handleTranscript(socket);
  });
  // 연결이 끊어졌을 때
  socket.on("disconnect", () => {
    console.log("클라이언트 연결이 끊어졌습니다.");
    socket.removeAllListeners(); // 연결이 끊어진 클라이언트의 소켓을 삭제
  });
});

//라우팅
app.get("/", (req, res) => {
  //index.html 보내기
  res.sendFile("index.html");
});

app.get("/voices/:fileName", async (req, res) => {
  const { fileName } = req.params;
  const filePath = path.resolve(`./src/server/voices/${fileName}`);

  //악의적인 파일 경로나 유효하지 않은 파일명을 요청한 경우 400 에러를 전송합니다.
  if (
    !fileName.match(
      /^speech-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.aac$/
    )
  ) {
    res.status(400).send("invalid file name");
    return;
  }

  //파일이 존재하지 않는 경우 404 에러를 전송합니다.
  if (!fs.existsSync(filePath)) {
    res.status(404).send("unable to find the voice file.");
    return;
  }

  res.status(200).sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    // 파일 전송이 성공적으로 완료된 후 삭제를 시도합니다.
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File is deleted successfully.");
      }
    });
  });
});

app.get("/healthcheck", (req, res) => {
  res.status(200).send("ok");
});

app.use(errorHandler);

server.listen(PORT, () => console.log(`listening on port ${PORT}...`));
