import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { TranslateContext } from "./Context";
import {
  SourceConfig,
  ResultsConfig,
  HistoryItem,
  DataToSendItems,
  DataToReceive,
} from "./TranslateInterfaces";

//user-defined components
import TranslateSource from "./TranslateSource";
import TranslateResults from "./TranslateResults";
import HistoryModal from "./history/HistoryModal";

//data
import { Socket } from "socket.io-client";

interface TranslatePropsType {
  webSocketRef: React.MutableRefObject<Socket | null>;
}

export default function Translate({ webSocketRef }: TranslatePropsType) {
  console.log("render Translate...");
  const context = useContext(TranslateContext);

  const [sourceConfig, setSourceConfig] = useState<SourceConfig>(
    context.sourceConfig
  );
  const [resultsConfig, setResultsConfig] = useState<ResultsConfig>(
    context.resultsConfig
  );
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
    if (webSocketRef.current === null) {
      alert("Cannot connect to the server. Please try again later.");
      return;
    }

    console.log(
      "translateText start... current Config:",
      sourceConfig,
      resultsConfig
    );

    //get data to send
    const { sourceLang, sourceText } = sourceConfig;

    const dataToSend: DataToSendItems = [];

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
    console.log(webSocketRef, typeof webSocketRef);
    const socket = webSocketRef.current;

    const handleTranslationResult = (data: DataToReceive) => {
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
  }, [webSocketRef?.current, updateResultsConfig]);

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
          sourceConfig,
          resultsConfig,
          translate,
          updateSourceConfig,
          updateShouldTranslate,
          updateShouldHistoryOpen,
          updateResultsConfig,
          webSocketRef,
        }}
      >
        <TranslateSource />
        <TranslateResults />
      </TranslateContext.Provider>
    </div>
  );
}