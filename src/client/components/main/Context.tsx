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
  sourceConfig: SourceConfig;
  resultsConfig: ResultsConfig;
  translate: () => Promise<void>;
  updateSourceConfig: (key: string, value: string | boolean | string[]) => void;
  updateResultsConfig: (
    index: number,
    key: string,
    value: string | boolean
  ) => void;
  updateShouldHistoryOpen: (value: boolean) => void;
  updateShouldTranslate: (value: boolean) => void;
  webSocketRef: React.MutableRefObject<Socket | null>;
}

interface AppContextType {
  shouldAiChatOpen: boolean;
  updateShouldAiChatOpen: (value: boolean) => void;
}

export const SourceContext = React.createContext<SourceContextType>({
  copyText: () => {},
  sendTtsRequest: () => {},
  isRecording: false,
  setIsRecording: () => {},
  updateEditareaValue: () => {},
});
export const ResultContext = React.createContext<ResultContextType>({
  resultConfig: getInitialConfigs().initialResultsConfig[0], //수정 필요: 초기값 설정
  updateResultConfig: () => {},
  copyText: () => {},
  sendTtsRequest: () => {},
});

export const TranslateContext = React.createContext<TranslateContextType>({
  sourceConfig: getInitialConfigs().initialSourceConfig,
  resultsConfig: getInitialConfigs().initialResultsConfig,
  translate: async () => {},
  updateSourceConfig: () => {},
  updateResultsConfig: () => {},
  updateShouldHistoryOpen: () => {},
  updateShouldTranslate: () => {},
  webSocketRef: { current: null },
});

export const AppContext = React.createContext<AppContextType>({
  shouldAiChatOpen: false,
  updateShouldAiChatOpen: (value: boolean) => {},
});

export default {
  ResultContext,
  SourceContext,
  TranslateContext,
  AppContext,
};
