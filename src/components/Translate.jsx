import React, { useState } from "react";
import { TranslateContext } from "./Context";

//user-defined components
import TranslateSource from "./TranslateSource";
import TranslateResults from "./TranslateResults";

//data
import supported from "../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것

function getInitialConfigs() {
  const supportedTools = supported.supportedTools.sort();
  const supportedSourceLangs = supported.deepLSupportedLangs.srcLangs.sort();
  const supportedTargetLangs = supported.deepLSupportedLangs.targetLangs.sort();
  const initialSourceLang = "Korean";
<<<<<<< HEAD:src/components/main/Translate.jsx
  const initialResultLang = "English (American)";
=======
  const initialResultLang = "English";

>>>>>>> parent of 2d07b6d (1. 헤더 추가):src/components/Translate.jsx
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

  return {
    initialSourceConfig,
    initialResultsConfig,
  };
}

export default function Translate() {
  // 관리하는 정보
  const { initialSourceConfig, initialResultsConfig } = getInitialConfigs();

  const [sourceConfig, setSourceConfig] = useState(initialSourceConfig);
  const [resultsConfig, setResultsConfig] = useState(initialResultsConfig);
  //update functions
  const updateSourceConfig = (key, value) => {
    console.log("update source config...");
    setSourceConfig((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const updateResultsConfig = (index, key, value) => {
    console.log("update result config...");
    setResultsConfig((prev) => {
      const newResultsConfig = [...prev];
      newResultsConfig[index][key] = value;
      return newResultsConfig;
    });
  };

  //get functions
  const getConfigs = () => {
    return {
      sourceConfig,
      resultsConfig,
    };
  };

<<<<<<< HEAD:src/components/main/Translate.jsx
  //translate functions
  const translateText = async () => {
    //get configs
    const configs = getConfigs();

    //extract data from configs
    const { sourceLang, sourceText } = configs.sourceConfig;
    console.log("sourceText", sourceText);
    const dataToSend = configs.resultsConfig
      .filter((resultConfig) => resultConfig.isPower)
      .map((resultConfig) => {
        return {
          srcLang: sourceLang,
          srcText: sourceText,
          index: resultConfig.index,
          targetLang: resultConfig.targetLang,
          targetTool: resultConfig.targetTool,
        };
      });

    //send data to server
    const baseURI = "http://localhost:4788";
    try {
      //send data(JSON format) to server
      const response = await axios({
        method: "post",
        url: `${baseURI}/translate`,
        data: dataToSend,
      });
      console.log("translate response: ", response);
    } catch (error) {
      console.log(error);
    }
  };

  // const applyTranslateResults = (results) => {
  //   results.forEach((result)=>{

  //   })
  // };

  // const generateSSEEndpoint = (baseURI) => {
  //   const source = new EventSource(`${baseURI}/events`);
  //   source.onmessage=applyTranslateResult;
  // };

=======
>>>>>>> parent of 2d07b6d (1. 헤더 추가):src/components/Translate.jsx
  //render
  return (
    <div className="Translate w-96 p-2 flex-col justify-center items-center gap-2 flex m-auto">
      <TranslateContext.Provider
        value={{
          sourceConfig,
          updateSourceConfig,
<<<<<<< HEAD:src/components/main/Translate.jsx
          translateText,
=======
>>>>>>> parent of 2d07b6d (1. 헤더 추가):src/components/Translate.jsx
        }}
      >
        <TranslateSource />
      </TranslateContext.Provider>

      <TranslateContext.Provider
        value={{
          updateResultsConfig,
        }}
      >
        <TranslateResults resultsConfig={resultsConfig} />
      </TranslateContext.Provider>
    </div>
  );
}
