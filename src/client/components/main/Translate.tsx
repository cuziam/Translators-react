import React, { useState, useEffect, useCallback, useRef } from "react";
import { TranslateContext } from "./Context";
import propTypes from "prop-types";

//communication
import axios from "axios";

//user-defined components
import TranslateSource from "./TranslateSource";
import TranslateResults from "./TranslateResults";
import HistoryModal from "./history/HistoryModal";

//data
import supported from "../../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것
import { Socket } from "socket.io-client";

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

interface dataToReceive {
  index: number;
  srcLang: string;
  srcText: string;
  targetLang: string;
  targetText: string;
  targetTool: string;
}
interface TranslateProps {
  webSocketRef: React.MutableRefObject<Socket>;
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

export default function Translate({ webSocketRef }: TranslateProps) {
  console.log("render Translate...");

  //initial states
  const { initialSourceConfig, initialResultsConfig } = getInitialConfigs();
  const [sourceConfig, setSourceConfig] =
    useState<SourceConfig>(initialSourceConfig);
  const [resultsConfig, setResultsConfig] =
    useState<ResultsConfig>(initialResultsConfig);
  const [shouldTranslate, setShouldTranslate] = useState<boolean>(false);
  const [shouldHistoryOpen, setShouldHistoryOpen] = useState<boolean>(false);

  //refs
  const history = useRef<HistoryItem[]>([]);

  //callbacks
  //update functions
  const updateSourceConfig = useCallback(
    (key: string, value: any): void => {
      setSourceConfig({ ...sourceConfig, [key]: value });
    },
    [sourceConfig]
  );

  const updateResultsConfig = useCallback(
    (index: number, key: string, value: any): void => {
      setResultsConfig((prevResultsConfig) => {
        const newResultsConfig = [...prevResultsConfig];
        newResultsConfig[index] = { ...newResultsConfig[index], [key]: value };
        return newResultsConfig;
      });
    },
    []
  );

  const updateShouldTranslate = useCallback((value: boolean): void => {
    console.log("updateShouldTranslate:", value);
    setShouldTranslate(value);
  }, []);

  const updateShouldHistoryOpen = useCallback((value: boolean): void => {
    setShouldHistoryOpen(value);
  }, []);

  //translate
  const translate = useCallback(async () => {
    console.log(
      "translateText start... current Config:",
      sourceConfig,
      resultsConfig
    );

    //get data to send
    const { sourceLang, sourceText } = sourceConfig;

    const dataToSend: DataToSendItem[] = [];

    resultsConfig.forEach((resultConfig, index) => {
      if (resultConfig.isPower === true) {
        const { targetLang, targetTool } = resultConfig;
        dataToSend.push({
          index: index,
          srcLang: sourceLang,
          srcText: sourceText,
          targetLang: targetLang,
          targetTool: targetTool,
        });
      }
    });

    console.log("dataToSend:", dataToSend);
    //send data and get response
    try {
      webSocketRef.current.emit("translate", dataToSend, (response: string) => {
        console.log("server message: ", response);
      });
    } catch (error) {
      console.log(error);
    }
  }, [sourceConfig, resultsConfig, webSocketRef]);

  //번역 요청 및 로딩 처리
  useEffect(() => {
    if (shouldTranslate) {
      translate();
      updateShouldTranslate(false);
      resultsConfig.forEach((_, index) => {
        if (resultsConfig[index].isPower === true) {
          updateResultsConfig(index, "isLoading", true);
        }
      });
    }
  }, [
    shouldTranslate,
    translate,
    updateShouldTranslate,
    resultsConfig,
    updateResultsConfig,
  ]);

  //번역 결과 처리
  useEffect(() => {
    if (webSocketRef.current === null) return;

    const socket = webSocketRef.current;

    const handleTranslationResult = (data: dataToReceive) => {
      console.log("translationResult:", data);
      const { index, srcText, targetText } = data;
      const historyItem: HistoryItem = { srcText, targetText };
      history.current.push(historyItem);
      console.log("history:", history.current);
      updateResultsConfig(index, "targetText", targetText);
      updateResultsConfig(index, "isLoading", false);
    };

    socket.on("translationResult", handleTranslationResult);

    return () => {
      socket.off("translationResult", handleTranslationResult); //메모리 누수 방지
    };
  }, [webSocketRef.current, updateResultsConfig]);

  //render
  return (
    <div className="Translate w-96 p-2 flex-col justify-center items-center gap-2 flex m-auto mb-52">
      <HistoryModal
        shouldHistoryOpen={shouldHistoryOpen}
        updateShouldHistoryOpen={updateShouldHistoryOpen}
        historyRef={history}
      />
      <TranslateContext.Provider
        value={{
          translate,
          sourceConfig,
          updateSourceConfig,
          updateShouldTranslate,
          updateShouldHistoryOpen,
          webSocketRef,
        }}
      >
        <TranslateSource />
      </TranslateContext.Provider>

      <TranslateContext.Provider
        value={{
          resultsConfig,
          updateResultsConfig,
          webSocketRef,
        }}
      >
        <TranslateResults />
      </TranslateContext.Provider>
    </div>
  );
}
