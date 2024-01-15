import React, { useState } from "react";
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

export default function Translate() {
  //initial configs
  const { initialSourceConfig, initialResultsConfig } = getInitialConfigs();
  const [sourceConfig, setSourceConfig] = useState(initialSourceConfig);
  const [resultsConfig, setResultsConfig] = useState(initialResultsConfig);
  const [eventSource, setEventSource] = useState(null);

  //update functions
  const updateSourceConfig = (key, value) => {
    console.log("update source config...");
    setSourceConfig({ ...sourceConfig, [key]: value });
    console.log("sourceConfig[key]: ", sourceConfig[key]);
  };

  const updateResultsConfig = (index, key, value) => {
    console.log("update results config...");
    setResultsConfig((prevResultsConfig) => {
      const newResultsConfig = [...prevResultsConfig];
      newResultsConfig[index] = { ...newResultsConfig[index], [key]: value };
      return newResultsConfig;
    });
    console.log("resultsConfig[index][key]: ", resultsConfig[index][key]);
  };

  //translate functions
  const translate = async () => {
    //get data to send
    console.log(sourceConfig, resultsConfig);
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
    console.log("dataToSend: ", dataToSend);

    //send data and get response
    try {
      const response = axios({
        method: "post",
        url: "http://localhost:4788/translate",
        data: dataToSend,
      });
      console.log("translate response: ", response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [eventSource]);

  //render
  return (
    <div className="Translate w-96 p-2 flex-col justify-center items-center gap-2 flex m-auto">
      <TranslateContext.Provider
        value={{
          translate,
          sourceConfig,
          updateSourceConfig,
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
