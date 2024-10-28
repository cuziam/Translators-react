interface SourceConfig {
  sourceLang: string;
  sourceText: string;
  supportedLangs: string[];
  history: HistoryItem[];
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
}
type ResultsConfig = ResultConfig[];

interface InitialConfig {
  initialSourceConfig: SourceConfig;
  initialResultsConfig: ResultsConfig;
}

interface DataToSendItem {
  index: number;
  srcLang: string;
  srcText: string;
  targetLang: string;
  targetTool: string;
}

type DataToSendItems = DataToSendItem[];

interface DataToReceive {
  index: number;
  srcLang: string;
  srcText: string;
  targetLang: string;
  targetText: string;
  targetTool: string;
}

export type {
  SourceConfig,
  HistoryItem,
  ResultConfig,
  ResultsConfig,
  InitialConfig,
  DataToSendItem,
  DataToSendItems,
  DataToReceive,
};
