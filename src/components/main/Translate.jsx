import React, { useState, useEffect, useCallback, useRef } from "react";
import { TranslateContext } from "./Context";

//axios
import axios from "axios";

//user-defined components
import TranslateSource from "./TranslateSource";
import TranslateResults from "./TranslateResults";
import HistoryModal from "./history/HistoryModal";

//data
import supported from "../../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것

const getInitialConfigs = () => {
  // 관리하는 정보
  const supportedTools = supported.supportedTools.sort();
  const supportedSourceLangs = supported.deepLSupportedLangs.srcLangs.sort();
  const supportedTargetLangs = supported.deepLSupportedLangs.targetLangs.sort();
  const initialSourceLang = "Korean";
  const initialResultLang = "English (American)";

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
  return { initialSourceConfig, initialResultsConfig };
};

//translate functions
const translateText = async (sourceConfig, resultsConfig) => {
  console.log(
    "translateText start... current Config:",
    sourceConfig,
    resultsConfig
  );

  //get data to send
  const { sourceLang, sourceText } = sourceConfig;
  const dataToSend = [];
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
    const response = await axios({
      method: "post",
      url: "https://translators24.com/translate",
      data: dataToSend,
    });
    console.log("translate response: ", response);
  } catch (error) {
    console.log(error);
  }
};

export default function Translate() {
  console.log("render Translate...");

  //initial states
  const { initialSourceConfig, initialResultsConfig } = getInitialConfigs();
  const [sourceConfig, setSourceConfig] = useState(initialSourceConfig);
  const [resultsConfig, setResultsConfig] = useState(initialResultsConfig);
  const [shouldTranslate, setShouldTranslate] = useState(false);
  const [shouldModalOpen, setShouldModalOpen] = useState(false);

  //refs
  const eventSourceRef = useRef(null);
  const history = useRef([]);

  //callbacks
  //update functions
  const updateSourceConfig = useCallback(
    (key, value) => {
      setSourceConfig({ ...sourceConfig, [key]: value });
    },
    [sourceConfig]
  );

  const updateResultsConfig = useCallback((index, key, value) => {
    setResultsConfig((prevResultsConfig) => {
      const newResultsConfig = [...prevResultsConfig];
      newResultsConfig[index] = { ...newResultsConfig[index], [key]: value };
      return newResultsConfig;
    });
  }, []);

  const updateShouldTranslate = useCallback((value) => {
    setShouldTranslate(value);
  }, []);

  const updateShouldModalOpen = useCallback((value) => {
    setShouldModalOpen(value);
  }, []);

  //translate
  const translate = useCallback(async () => {
    translateText(sourceConfig, resultsConfig);
  }, [sourceConfig, resultsConfig]);

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
    sourceConfig.sourceText,
    shouldTranslate,
    translate,
    updateShouldTranslate,
    resultsConfig,
    updateResultsConfig,
  ]);

  //번역 결과 처리
  useEffect(() => {
    if (eventSourceRef.current === null) {
      eventSourceRef.current = new EventSource(
        "https://translators24.com/events"
      );
    }
    eventSourceRef.current.onmessage = (event) => {
      //statuscode 200이 아닌 경우
      // if (event.lastEventId !== "200") {
      //   console.log("eventSource error:", event);
      //   return;
      // }
      //statuscode 200인 경우
      console.log("eventSource data:", event.data);
      const { index, srcText, targetText } = JSON.parse(event.data)[0];
      const historyItem = {
        srcText: srcText,
        targetText: targetText,
      };
      history.current.push(historyItem);
      console.log("history:", history.current);
      updateResultsConfig(index, "targetText", targetText);
      updateResultsConfig(index, "isLoading", false);
    };
    eventSourceRef.current.onopen = (event) => {
      console.log("eventSource open:", event);
    };

    return () => {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    };
  }, []);

  //render
  return (
    <div className="Translate w-96 p-2 flex-col justify-center items-center gap-2 flex m-auto mb-52">
      <HistoryModal
        shouldModalOpen={shouldModalOpen}
        updateShouldModalOpen={updateShouldModalOpen}
        historyRef={history}
      />
      <TranslateContext.Provider
        value={{
          translate,
          sourceConfig,
          updateSourceConfig,
          updateShouldTranslate,
          updateShouldModalOpen,
        }}
      >
        <TranslateSource />
      </TranslateContext.Provider>

      <TranslateContext.Provider
        value={{
          resultsConfig,
          updateResultsConfig,
        }}
      >
        <TranslateResults />
      </TranslateContext.Provider>
    </div>
  );
}
