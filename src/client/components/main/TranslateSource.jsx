import React, { useState, useRef, useCallback } from "react";
import { useEffect, useContext } from "react";
import { SourceContext, TranslateContext } from "./Context";

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
  const { updateSourceConfig, webSocketRef } = useContext(TranslateContext);

  //util functions
  const editareaRef = useRef(null);
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
        //응답이 오면 음성 재생
        //response타입이 url인지 확인
        if (typeof response === "string" && response.startsWith("http")) {
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
  }, [webSocketRef, editareaRef]);

  const updateSourceText = useCallback(() => {
    const text = editareaRef.current.value;
    console.log("updateSourceText:", text);
    updateSourceConfig("sourceText", text);
  }, []);

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
