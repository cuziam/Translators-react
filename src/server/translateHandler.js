import fs from "fs";
import path from "path";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

import dotenv from "dotenv";
dotenv.config();

import {
  languageToISOCode,
  ISOCodeToLanguage,
  ISOCodeForTargetTool,
} from "./util.js";

//통신 패키지
import axios from "axios";

//보안
import xss from "xss";

async function handleTranslate(socket) {
  socket.on("translate", async (message, callback) => {
    if (!message) {
      callback("Please send a non-empty string.");
      return;
    }
    console.log("클라이언트 번역 요청을 받았습니다.", message);
    //번역 로직 처리
    try {
      const results = await translateClientReq(message, socket);
      console.log("번역이 완료되었습니다.");
      callback("Translation complete.");
    } catch (err) {
      console.error(err);
      callback("Translation Error, please try later.");
    }
  });
}

//papago 번역 api
const translatePapago = async function (
  index,
  srcText,
  srcLang,
  targetLang,
  socket
) {
  console.log(srcText, srcLang, targetLang);
  const clientId = process.env.X_NCP_APIGW_API_KEY_ID;
  const clientSecret = process.env.X_NCP_APIGW_API_KEY;
  const apiUrl = "	https://naveropenapi.apigw.ntruss.com/nmt/v1/translation";

  const options = {
    method: "POST",
    url: apiUrl,
    headers: {
      "X-NCP-APIGW-API-KEY-ID": clientId,
      "X-NCP-APIGW-API-KEY": clientSecret,
    },
    data: {
      source: srcLang,
      target: ISOCodeForTargetTool(targetLang, "Papago"),
      text: srcText,
    },
  };
  try {
    const response = await axios(options);
    console.log(
      "papago 번역 성공: ",
      response.data.message.result.translatedText
    );
    socket.emit("translationResult", {
      index: index,
      srcLang: ISOCodeToLanguage(srcLang),
      srcText: srcText,
      targetLang: ISOCodeToLanguage(targetLang),
      targetText: response.data.message.result.translatedText,
      targetTool: "Papago",
    });
  } catch (error) {
    console.log("papago 번역 실패: ", error.response.data.error);
    const errorCode = error.response.data.error.errorCode;
    let textToSend;
    if (100 <= Number(errorCode) && Number(errorCode) <= 900) {
      textToSend = "Server Error: Sorry... Please try again later.";
    } else {
      textToSend = error.response.data.error.message;
    }
    socket.emit("translationResult", {
      index: index,
      srcLang: ISOCodeToLanguage(srcLang),
      srcText: srcText,
      targetLang: ISOCodeToLanguage(targetLang),
      targetText: textToSend,
      targetTool: "Papago",
    });
    throw error;
  }
};

//구글 번역 api
import { TranslationServiceClient } from "@google-cloud/translate";
const translationClient = new TranslationServiceClient();

const projectId = process.env.GOOGLE_PROJECT_ID;
const location = process.env.GOOGLE_LOCATION;
const translateGoogle = async function (
  index,
  srcText,
  srcLang,
  targetLang,
  socket
) {
  console.log(srcText, srcLang, targetLang);
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [srcText],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: srcLang,
    targetLanguageCode: ISOCodeForTargetTool(targetLang, "Google Translator"),
  };
  try {
    const [response] = await translationClient.translateText(request);
    console.log("Google 번역 성공: ", response.translations[0].translatedText);
    socket.emit("translationResult", {
      index: index,
      srcLang: ISOCodeToLanguage(srcLang),
      srcText: srcText,
      targetLang: ISOCodeToLanguage(targetLang),
      targetText: response.translations[0].translatedText,
      targetTool: "Google Translator",
    });
  } catch (error) {
    console.log("Google 번역 실패: ", error);
    socket.emit("translationResult", {
      index: index,
      srcLang: ISOCodeToLanguage(srcLang),
      srcText: srcText,
      targetLang: ISOCodeToLanguage(targetLang),
      targetText: error.details,
      targetTool: "Google Translator",
    });
    throw error;
  }
};

//deepl 번역 api
import deepl from "deepl-node";
const authKey = process.env.DEEPL_AUTH_KEY;
const translator = new deepl.Translator(authKey);
const translateDeepl = async function (
  index,
  srcText,
  srcLang,
  targetLang,
  socket
) {
  console.log(srcText, srcLang, targetLang);
  try {
    const response = await translator.translateText(
      srcText,
      srcLang,
      targetLang
    );
    console.log("DeepL 번역 성공: ", response.text);
    socket.emit("translationResult", {
      index: index,
      srcLang: ISOCodeToLanguage(srcLang),
      srcText: srcText,
      targetLang: ISOCodeToLanguage(targetLang),
      targetText: response.text,
      targetTool: "DeepL",
    });
  } catch (error) {
    console.log("DeepL 번역 실패:", error);
    socket.emit("translationResult", {
      index: index,
      srcLang: ISOCodeToLanguage(srcLang),
      srcText: srcText,
      targetLang: ISOCodeToLanguage(targetLang),
      targetText: error.message,
      targetTool: "DeepL",
    });
    throw error;
  }
};

const translateClientReq = async function (reqBody, socket) {
  console.log("translateClientReq");
  const translationResults = [];

  for (const config of reqBody) {
    let { srcLang, srcText, targetLang, targetTool, index } = config;
    srcLang = languageToISOCode(srcLang);
    srcText = xss(srcText);
    targetLang = languageToISOCode(targetLang);

    let result;
    switch (targetTool) {
      case "Papago":
        result = await translatePapago(
          index,
          srcText,
          srcLang,
          targetLang,
          socket
        )
          .then(() => true)
          .catch(() => false);
        break;
      case "Google":
        result = await translateGoogle(
          index,
          srcText,
          srcLang,
          targetLang,
          socket
        )
          .then(() => true)
          .catch(() => false);
        break;
      case "DeepL":
        result = await translateDeepl(
          index,
          srcText,
          srcLang,
          targetLang,
          socket
        )
          .then(() => true)
          .catch(() => false);
        break;
      default:
        break;
    }
    translationResults.push(result);
  }

  return translationResults;
};

export { handleTranslate };
