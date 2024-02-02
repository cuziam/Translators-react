import { useContext, useCallback, useRef } from "react";

//user-defined components
import TargetBar from "./TargetBar";
import TargetEditarea from "./TargetEditarea";
import TargetToolbar from "./TargetToolbar";
import { TranslateContext, ResultContext } from "./Context";
import propTypes from "prop-types";

function TranslateResult({ index }) {
  //define state for TranslateResult
  const { resultsConfig, updateResultsConfig, webSocketRef } =
    useContext(TranslateContext);

  //util functions
  const textareaRef = useRef(null);
  const copyText = () => {
    console.log(textareaRef.current);
    const text = textareaRef.current.innerText;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const sendTtsRequest = useCallback(() => {
    webSocketRef.current.emit(
      "ttsRequest",
      textareaRef.current.innerText,
      (response) => {
        //응답이 오면 음성 재생
        //response타입이 url인지 확인
        if (
          typeof response === "string" &&
          response.startsWith(`${import.meta.env.VITE_APP_URL}`)
        ) {
          try {
            const audio = new Audio(response);
            audio.play();
          } catch (error) {
            console.log(error);
          }
        } else {
          alert("server error: TTSError");
        }
      }
    );
  }, [webSocketRef, textareaRef]);

  //define resultConfig and updateResultConfig
  const resultConfig = resultsConfig[index];
  const updateResultConfig = (key, value) => {
    updateResultsConfig(index, key, value);
  };

  //render
  return resultConfig.isPower === true ? (
    <ResultContext.Provider
      value={{
        resultConfig,
        updateResultConfig,
        copyText,
        sendTtsRequest,
      }}
    >
      <div className="PowerOn w-80 h-48 bg-white flex-col justify-center items-start flex rounded-md">
        <TargetBar />
        <TargetEditarea
          ref={textareaRef}
          targetText={resultsConfig[index].targetText}
        />
        <TargetToolbar />
      </div>
    </ResultContext.Provider>
  ) : (
    <ResultContext.Provider
      value={{
        resultConfig,
        updateResultConfig,
      }}
    >
      <TargetBar />
    </ResultContext.Provider>
  );
}

//prop-types
TranslateResult.propTypes = {
  index: propTypes.number.isRequired,
  initialResultConfig: propTypes.shape({
    isPower: propTypes.bool.isRequired,
    targetLang: propTypes.string.isRequired,
    targetTool: propTypes.string.isRequired,
    targetText: propTypes.string.isRequired,
    supportedTools: propTypes.array.isRequired,
    supportedLangs: propTypes.array.isRequired,
    isLoading: propTypes.bool.isRequired,
  }),
};

export default TranslateResult;
