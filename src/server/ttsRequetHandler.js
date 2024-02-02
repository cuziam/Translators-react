import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { randomUUID } from "crypto";
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

import dotenv from "dotenv";
dotenv.config();

async function handleTtsRequest(socket) {
  socket.on("ttsRequest", async (message, callback) => {
    if (!message) {
      callback("Please send a non-empty string.");
      return;
    }
    console.log("클라이언트 TTS 요청을 받았습니다.", message);
    //TTS 로직 처리
    try {
      const opus = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        response_format: "opus",
        input: message,
      });

      const buffer = Buffer.from(await opus.arrayBuffer());
      const fileName = `speech-${randomUUID()}.opus`; //고유한 파일명 생성
      const speechFilePath = path.resolve(`./src/server/voices/${fileName}`);
      await fs.promises.writeFile(speechFilePath, buffer); //파일 저장
      console.log("TTS 파일을 생성하였습니다.");
      //클라이언트에게 파일 URL 전송
      const fileUrl = `${process.env.APP_URL}/voices/${fileName}`;
      callback(fileUrl);
    } catch (err) {
      console.error(err);
      callback("TTS Error, please try later.");
    }
  });
}

export { handleTtsRequest };
