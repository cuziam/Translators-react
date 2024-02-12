import fs from "fs";
import path from "path";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { Buffer } from "buffer";
dotenv.config();

const handleTranscript = async (socket) => {
  socket.on("transcript", async (audioArrayBuffer, callback) => {
    if (!audioArrayBuffer) {
      callback("Please send a not empty file.");
      return;
    }
    const fileName = `${randomUUID()}.webm`;
    const filePath = path.resolve(`./src/server/voices/${fileName}`);
    fs.writeFileSync(filePath, Buffer.from(audioArrayBuffer));

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
    });
    console.log(transcription.text);
    callback(transcription.text);
    // 파일 전송이 성공적으로 완료된 후 삭제를 시도합니다.
    // fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error("Error deleting file:", err);
    //   } else {
    //     console.log("File is deleted successfully.");
    //   }
    // });
  });
};

export { handleTranscript };
