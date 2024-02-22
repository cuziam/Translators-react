import { useContext, useCallback, useRef } from "react";
import axios from "axios";

//user-defined components
import TargetBar from "./TargetBar";
import TargetEditarea from "./TargetEditarea";
import TargetToolbar from "./TargetToolbar";
import { TranslateContext, ResultContext } from "./Context";

interface TranslateResultPropsType {
  index: number;
}

function TranslateResult({ index }: TranslateResultPropsType) {
  //define state for TranslateResult
  const { resultsConfig, updateResultsConfig, webSocketRef } =
    useContext(TranslateContext);

  //util functions
  const textareaRef = useRef<HTMLParagraphElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const copyText = () => {
    console.log(textareaRef.current);
    if (textareaRef.current !== null) {
      const text = textareaRef.current.innerText;
      navigator.clipboard.writeText(text);
      alert("Copied!");
    } else {
      alert("cannot find text... sorry...");
    }
  };

  const sendTtsRequest = useCallback(() => {
    if (webSocketRef.current === null || textareaRef.current === null) return;
    webSocketRef.current.emit(
      "ttsRequest",
      textareaRef.current.innerText,
      (response: string) => {
        //audioContext가 생성되어 있지 않으면 생성
        if (audioContextRef.current === null) {
          audioContextRef.current = new window.AudioContext();
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
              return audioContextRef.current?.decodeAudioData(response.data);
            })
            .then((audioBuffer) => {
              if (!audioBuffer) {
                throw new Error("audioBuffer is not created");
              }
              if (audioContextRef.current === null) return;
              const source = audioContextRef.current.createBufferSource();

              if (!source) {
                throw new Error("source is not created");
              }
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
  const updateResultConfig = (key: string, value: any) => {
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

export default TranslateResult;
