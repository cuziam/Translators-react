import React, { useEffect, useCallback, useRef } from "react";
import { TranslateContext } from "./Context";
import {
  HistoryItem,
  DataToSendItems,
  DataToReceive,
} from "./TranslateInterfaces";
import { RootState } from "../../store/index";
import { useSelector, useDispatch } from "react-redux";
import { translateSliceActions } from "../../store/translate-slice";

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
  //redux
  const dispatch = useDispatch();
  const { shouldTranslate, sourceConfig, resultsConfig } = useSelector(
    (state: RootState) => state.translate
  );

  //refs
  const history = useRef<HistoryItem[]>([]);

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
      dispatch(translateSliceActions.updateShouldTranslate(false));
      resultsConfig.forEach((_, index) => {
        if (resultsConfig[index].isPower === true) {
          dispatch(
            translateSliceActions.updateResultsConfig({
              index,
              key: "isLoading",
              value: true,
            })
          );
        }
      });
    }
  }, [shouldTranslate, translate, resultsConfig, dispatch]);

  //번역 결과 처리
  useEffect(() => {
    if (webSocketRef.current === null) return;
    const socket = webSocketRef.current;

    const handleTranslationResult = (data: DataToReceive) => {
      console.log("translationResult:", data);
      const { index, srcText, targetText } = data;
      const historyItem: HistoryItem = { srcText, targetText };
      history.current.push(historyItem);
      console.log("history:", history.current);
      dispatch(
        translateSliceActions.updateResultsConfig({
          index,
          key: "targetText",
          value: targetText,
        })
      );
      dispatch(
        translateSliceActions.updateResultsConfig({
          index,
          key: "isLoading",
          value: false,
        })
      );
    };

    socket.on("translationResult", handleTranslationResult);

    return () => {
      socket.off("translationResult", handleTranslationResult); //메모리 누수 방지
    };
  }, [webSocketRef?.current, dispatch]);

  //render
  return (
    <div className="Translate w-96 p-2 flex-col justify-center items-center gap-2 flex m-auto mb-52">
      <HistoryModal historyRef={history} />
      <TranslateContext.Provider
        value={{
          translate,
          webSocketRef,
        }}
      >
        <TranslateSource />
        <TranslateResults />
      </TranslateContext.Provider>
    </div>
  );
}
