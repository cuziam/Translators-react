import React from "react";
import { Socket } from "socket.io-client";
import supported from "../../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것
import {
  SourceConfig,
  ResultConfig,
  ResultsConfig,
  InitialConfig,
} from "./TranslateInterfaces";

const getInitialConfigs = (): InitialConfig => {
  // 관리하는 정보
  const supportedTools: string[] = supported.supportedTools.sort();
  const supportedSourceLangs: string[] =
    supported.deepLSupportedLangs.srcLangs.sort();
  const supportedTargetLangs: string[] =
    supported.deepLSupportedLangs.targetLangs.sort();
  const initialSourceLang: string = "Korean";
  const initialResultLang: string = "English (American)";

  const initialSourceConfig: SourceConfig = {
    sourceLang: initialSourceLang,
    sourceText: "",
    supportedLangs: supportedSourceLangs,
    history: [],
  };

  const initialResultsConfig: ResultsConfig = [
    {
      isPower: true,
      targetLang: initialResultLang,
      targetTool: "Google",
      targetText: "",
      supportedTools: supportedTools,
      supportedLangs: supportedTargetLangs,
      isLoading: false,
    },
    {
      isPower: true,
      targetLang: initialResultLang,
      targetTool: "DeepL",
      targetText: "",
      supportedTools: supportedTools,
      supportedLangs: supportedTargetLangs,
      isLoading: false,
    },
    {
      isPower: false,
      targetLang: initialResultLang,
      targetTool: "Papago",
      targetText: "",
      supportedTools: supportedTools,
      supportedLangs: supportedTargetLangs,
      isLoading: false,
    },
  ];
  return { initialSourceConfig, initialResultsConfig };
};

interface SourceContextType {
  copyText: () => void;
  sendTtsRequest: () => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  updateEditareaValue: (value: string) => void;
}
interface ResultContextType {
  resultConfig: ResultConfig;
  updateResultConfig: (key: string, value: any) => void;
  copyText?: () => void;
  sendTtsRequest?: () => void;
}

interface TranslateContextType {
  translate: () => Promise<void>;
  webSocketRef: React.MutableRefObject<Socket | null>;
}

interface AppContextType {
  shouldAiChatOpen: boolean;
  updateShouldAiChatOpen: (value: boolean) => void;
  webSocketRef: React.MutableRefObject<Socket | null>;
}

export const SourceContext = React.createContext<SourceContextType>({
  copyText: () => {},
  sendTtsRequest: () => {},
  isRecording: false,
  setIsRecording: () => {},
  updateEditareaValue: () => {},
});
export const ResultContext = React.createContext<ResultContextType>({
  resultConfig: {
    isPower: true,
    targetLang: "",
    targetTool: "",
    targetText: "",
    supportedTools: [],
    supportedLangs: [],
    isLoading: false,
  },
  updateResultConfig: () => {},
  copyText: () => {},
  sendTtsRequest: () => {},
});

export const TranslateContext = React.createContext<TranslateContextType>({
  translate: async () => {}, //비동기라서 다시 수정 필요
  webSocketRef: { current: null },
});

export const AppContext = React.createContext<AppContextType>({
  shouldAiChatOpen: false,
  updateShouldAiChatOpen: (value: boolean) => {},
  webSocketRef: { current: null },
});

export default {
  ResultContext,
  SourceContext,
  TranslateContext,
  AppContext,
};
