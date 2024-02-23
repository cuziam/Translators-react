import { createSlice } from "@reduxjs/toolkit";

import supported from "../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것
interface SourceConfig {
  sourceLang: string;
  sourceText: string;
  supportedLangs: string[];
  history: HistoryItem[];
  [key: string]: string | string[] | HistoryItem[];
}
interface HistoryItem {
  srcText: string;
  targetText: string;
}

interface ResultConfig {
  isPower: boolean;
  targetLang: string;
  targetTool: string;
  targetText: string;
  supportedTools: string[];
  supportedLangs: string[];
  isLoading: boolean;
  [key: string]: string | string[] | HistoryItem[] | boolean;
}
type ResultsConfig = ResultConfig[];

interface InitialConfig {
  initialSourceConfig: SourceConfig;
  initialResultsConfig: ResultsConfig;
}

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

interface translateState {
  sourceConfig: SourceConfig;
  resultsConfig: ResultsConfig;
  shouldTranslate: boolean;
  shouldHistoryOpen: boolean;
}

interface updateSourceConfigPayload {
  key: keyof SourceConfig;
  value: string | string[] | HistoryItem[];
}
const translateSlice = createSlice({
  name: "translate",
  initialState: {
    sourceConfig: getInitialConfigs().initialSourceConfig,
    resultsConfig: getInitialConfigs().initialResultsConfig,
    shouldTranslate: false,
    shouldHistoryOpen: false,
  } as translateState,
  reducers: {
    updateSourceConfig: (state, action) => {
      const { key, value } = action.payload;
      state.sourceConfig[key] = value;
    },
    updateResultsConfig: (state, action) => {
      const { index, key, value } = action.payload;
      state.resultsConfig[index][key] = value;
    },
    updateShouldTranslate: (state, action) => {
      state.shouldTranslate = action.payload;
    },
    updateShouldHistoryOpen: (state, action) => {
      state.shouldHistoryOpen = action.payload;
    },
  },
});

export const translateSliceActions = translateSlice.actions;
export default translateSlice;
