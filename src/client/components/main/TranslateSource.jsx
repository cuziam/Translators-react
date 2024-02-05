import React, { useState, useRef, useCallback } from "react";
import { useEffect, useContext } from "react";
import { SourceContext, TranslateContext } from "./Context";
import axios from "axios";

import SourceBar from "./SourceBar";
import SourceEditarea from "./SourceEditarea";
import SourceToolbar from "./SourceToolbar";

import propTypes from "prop-types";

//legacy code
class undoRedoHistory {
  constructor() {
    this.undoHistory = [];
    this.redoHistory = [];
  }

  addAction(action) {
    this.undoHistory.push(action);
    this.redoHistory = []; //redoHistory 초기화
  }

  undo() {
    if (this.undoHistory.length === 0) return ""; //undoHistory가 비어있으면 빈 문자열 반환
    const action = this.undoHistory.pop();
    this.redoHistory.push(action);
    return action;
  }

  redo() {
    if (this.redoHistory.length === 0) return ""; //redoHistory가 비어있으면 빈 문자열 반환
    const action = this.redoHistory.pop();
    this.undoHistory.push(action);
    return action;
  }
}

function TranslateSource() {
  //context
  const { updateSourceConfig, webSocketRef, sourceConfig } =
    useContext(TranslateContext);

  //util functions
  const editareaRef = useRef(null);
  const audioContextRef = useRef(null);

  const copyText = useCallback(() => {
    console.log(editareaRef.current);
    const text = editareaRef.current.value;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }, []);

  const sendTtsRequest = useCallback(() => {
    webSocketRef.current.emit(
      "ttsRequest",
      editareaRef.current.value,
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
  }, [webSocketRef, editareaRef, audioContextRef]);

  const updateSourceText = useCallback(() => {
    const text = editareaRef.current.value;
    console.log("updateSourceText:", text);
    updateSourceConfig("sourceText", text);
  }, [sourceConfig, updateSourceConfig, editareaRef]);

  //render
  return (
    <div className="Translatesource w-80 flex-col justify-center items-start flex relative">
      <SourceContext.Provider
        value={{ copyText, updateSourceText, sendTtsRequest }}
      >
        <SourceBar />
        <SourceEditarea ref={editareaRef} />
        <SourceToolbar />
      </SourceContext.Provider>
    </div>
  );
}

TranslateSource.propTypes = {
  initialSourceConfig: propTypes.object,
};

export default TranslateSource;
