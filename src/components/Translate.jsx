import { TranslateContext } from "./Context";

//user-defined components
import TranslateSource from "./TranslateSource";
import TranslateResults from "./TranslateResults";

//data
import supported from "../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것

export default function Translate() {
  //utility functions
  // const copy = (text) => {
  //   console.log("copy result...");
  //   navigator.clipboard.writeText(text);
  // };

  // const getHistory = () => {
  //   //TODO: get history from latest config
  //   return [];
  // };

  // 관리하는 정보
  const supportedTools = supported.supportedTools.sort();
  const supportedSourceLangs = supported.deepLSupportedLangs.srcLangs.sort();
  const supportedTargetLangs = supported.deepLSupportedLangs.targetLangs.sort();
  const initialSourceLang = "Korean";
  const initialResultLang = "English";

  const initialSourceConfig = {
    sourceLang: initialSourceLang,
    sourceText: "",
    supportedLangs: supportedSourceLangs,
    history: [],
  };

  const initialResultsConfig = [
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

  //update functions
  const updateSourceConfig = (key, value) => {
    console.log("update source config...");
    initialSourceConfig[key] = value;
    console.log("sourceConfig[key]: ", initialSourceConfig[key]);
  };

  const updateResultsConfig = (index, value) => {
    console.log("update results config...");
    initialResultsConfig[index] = value;
    console.log("resultsConfig[index]: ", initialResultsConfig[index]);
  };

  //get functions
  const getSourceConfig = () => {
    return initialSourceConfig;
  };

  const getResultsConfig = () => {
    return initialResultsConfig;
  };

  const getResultConfig = (index) => {
    return initialResultsConfig[index];
  };

  //render
  return (
    <div className="Translate w-96 p-2 flex-col justify-center items-center gap-2 flex m-auto">
      <TranslateContext.Provider
        value={{
          initialSourceConfig,
          updateSourceConfig,
        }}
      >
        <TranslateSource initialSourceConfig={initialSourceConfig} />
      </TranslateContext.Provider>

      <TranslateContext.Provider
        value={{
          initialResultsConfig,
          updateResultsConfig,
        }}
      >
        <TranslateResults initialResultsConfig={initialResultsConfig} />
      </TranslateContext.Provider>
    </div>
  );
}
