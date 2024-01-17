import React, { useState, useRef } from "react";
import { useEffect, useContext } from "react";
import { SourceContext, TranslateContext } from "./Context";

import SourceBar from "./SourceBar";
import SourceEditarea from "./SourceEditarea";
import SourceToolbar from "./SourceToolbar";

import propTypes from "prop-types";

function TranslateSource() {
  //context
  const { updateSourceConfig } = useContext(TranslateContext);
  //util functions
  const editareaRef = useRef(null);
  const copyText = () => {
    console.log(editareaRef.current);
    const text = editareaRef.current.value;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const updateSourceText = () => {
    const text = editareaRef.current.value;
    console.log("updateSourceText:", text);
    updateSourceConfig("sourceText", text);
  };

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
