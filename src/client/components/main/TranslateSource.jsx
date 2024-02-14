import React, { useState, useRef, useCallback } from "react";
import { useEffect, useContext } from "react";
import { SourceContext, TranslateContext } from "./Context";
import axios from "axios";

import SourceBar from "./SourceBar";
import SourceEditarea from "./SourceEditarea";
import SourceToolbar from "./SourceToolbar";

import propTypes from "prop-types";

// TranslateSource 컴포넌트
function TranslateSource() {
  //context
  const { updateSourceConfig, webSocketRef, updateShouldTranslate } =
    useContext(TranslateContext);
  const editareaRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [editareaValue, setEditareaValue] = useState("");

  //util functions
  const copyText = useCallback(() => {
    console.log(editareaRef.current);
    const text = editareaValue;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }, []);

  const sendTtsRequest = useCallback(() => {
    webSocketRef.current.emit("ttsRequest", editareaValue, (response) => {
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
    });
  }, [webSocketRef, audioContextRef, editareaValue]);

  const updateEditareaValue = useCallback((text) => {
    setEditareaValue(text);
  }, []);

  const startRecord = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder; // 현재 MediaRecorder 인스턴스를 ref에 저장
      let audioChunks = [];

      mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.start(500);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioArrayBuffer = await audioBlob.arrayBuffer();
        webSocketRef.current.emit(
          "transcript",
          audioArrayBuffer,
          (response) => {
            console.log("transcript response:", response);
            updateEditareaValue(response);
          }
        );
      };

      //녹음시간 10초 제한
      setTimeout(() => {
        mediaRecorder.stop();
      }, 10000);
    });
  }, [webSocketRef, mediaRecorderRef, updateEditareaValue]);

  const stopRecord = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // MediaRecorder 인스턴스의 stop 메소드 호출로 녹음 중지
    }
  }, [mediaRecorderRef]);

  useEffect(() => {
    if (editareaValue.length > 0) {
      // 그 후의 렌더링에서 디바운싱 로직 실행
      const debounce = setTimeout(() => {
        updateSourceConfig("sourceText", editareaValue);
        updateShouldTranslate(true);
      }, 1300);

      return () => clearTimeout(debounce);
    }
  }, [editareaValue, updateShouldTranslate]);

  useEffect(() => {
    if (isRecording === true) {
      startRecord();
    } else if (isRecording === false) {
      stopRecord();
    }
  }, [isRecording, startRecord, stopRecord]);

  //render
  return (
    <div className="Translatesource w-80 flex-col justify-center items-start flex relative">
      <SourceContext.Provider
        value={{
          copyText,
          sendTtsRequest,
          isRecording,
          setIsRecording,
        }}
      >
        <SourceBar />
        <SourceEditarea
          editareaValue={editareaValue}
          updateEditareaValue={updateEditareaValue}
        />
        <SourceToolbar />
      </SourceContext.Provider>
    </div>
  );
}

TranslateSource.propTypes = {
  initialSourceConfig: propTypes.object,
};

export default TranslateSource;
