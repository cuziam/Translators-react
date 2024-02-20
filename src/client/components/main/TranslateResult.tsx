import { useContext, useCallback, useRef } from "react";
import axios from "axios";

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
  const audioContextRef = useRef(null);

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
        //audioContext가 생성되어 있지 않으면 생성
        if (audioContextRef.current === null) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        //response타입이 url인지 확인
        if (
          typeof response === "string" &&
          response.startsWith(`${import.meta.env.VITE_APP_URL}`)
        ) {
          // 오디오 파일 로드 및 재생
          axios
            .get(response, { responseType: "arraybuffer" })
            .then((response) => {
              // audioContext는 이 컴포넌트 내에서 미리 생성되어 있어야 합니다.
              return audioContextRef.current.decodeAudioData(response.data);
            })
            .then((audioBuffer) => {
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              source.start();
            })
            .catch((error) => console.log(error));
        } else {
          alert(response);
        }
      }
    );
  }, [webSocketRef, textareaRef, audioContextRef]);

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
