import React, { useState, useRef, useCallback } from "react";
import { useEffect, useContext } from "react";
import { SourceContext, TranslateContext } from "./Context";

import SourceBar from "./SourceBar";
import SourceEditarea from "./SourceEditarea";
import SourceToolbar from "./SourceToolbar";

import propTypes from "prop-types";

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
  const { updateSourceConfig } = useContext(TranslateContext);

  //util functions
  const editareaRef = useRef(null);
  const copyText = useCallback(() => {
    console.log(editareaRef.current);
    const text = editareaRef.current.value;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }, []);

  const updateSourceText = useCallback(() => {
    const text = editareaRef.current.value;
    console.log("updateSourceText:", text);
    updateSourceConfig("sourceText", text);
  }, []);

  //render
  return (
    <div className="Translatesource w-80 flex-col justify-center items-start flex relative">
      <SourceContext.Provider value={{ copyText, updateSourceText }}>
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
