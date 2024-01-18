import React, { useState, useEffect, useCallback, useRef } from "react";
import { TranslateContext } from "./Context";

//axios
import axios from "axios";

//user-defined components
import TranslateSource from "./TranslateSource";
import TranslateResults from "./TranslateResults";

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
      url: "http://localhost:4788/translate",
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

  //refs
  const eventSourceRef = useRef(null);

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

  //translate
  const translate = useCallback(async () => {
    translateText(sourceConfig, resultsConfig);
  }, [sourceConfig, resultsConfig]);

  //translate when shouldTranslate is true
  useEffect(() => {
    if (shouldTranslate) {
      translate();
      updateShouldTranslate(false);
    }
  }, [
    sourceConfig.sourceText,
    shouldTranslate,
    translate,
    updateShouldTranslate,
  ]);

  //eventController
  useEffect(() => {
    if (eventSourceRef.current === null) {
      eventSourceRef.current = new EventSource("http://localhost:4788/events");

      eventSourceRef.current.onmessage = (event) => {
        console.log("eventSource data:", event.data);
        const { index, targetText } = JSON.parse(event.data)[0];
        console.log("index:", index, "targetText:", targetText);
        updateResultsConfig(index, "targetText", targetText);
      };
      eventSourceRef.current.onopen = (event) => {
        console.log("eventSource open:", event);
      };
      eventSourceRef.current.onerror = (event) => {
        console.log("eventSource error:", event);
        console.log(
          "eventSource close... eventSource state:",
          eventSourceRef.current.readyState
        );
        eventSourceRef.current.close();
      };

      return () => {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      };
    }
  }, []);

  //render
  return (
    <div className="Translate w-96 p-2 flex-col justify-center items-center gap-2 flex m-auto">
      <TranslateContext.Provider
        value={{
          translate,
          sourceConfig,
          updateSourceConfig,
          updateShouldTranslate,
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
