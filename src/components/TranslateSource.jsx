import React, { useRef } from "react";
import { useContext } from "react";
import { SourceContext, TranslateContext } from "./Context";

import SourceBar from "./SourceBar";
import SourceEditarea from "./SourceEditarea";
import SourceToolbar from "./SourceToolbar";

function TranslateSource() {
  const { updateSourceConfig } = useContext(TranslateContext);

  const editRef = useRef(null);
  const updateSourceText = () => {
    console.log("ref: ", editRef);
    console.log("update source text...", editRef.current.value);
    updateSourceConfig("sourceText", editRef.current.value);
  };

  //util functions
  const copyText = () => {
    console.log(editRef.current);
    const text = editRef.current.value;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  //render
  return (
    <div className="Translatesource w-80 flex-col justify-center items-start flex relative">
      <SourceBar />{" "}
      <SourceContext.Provider value={{ copyText, updateSourceText }}>
        <SourceEditarea ref={editRef} />
        <SourceToolbar />{" "}
      </SourceContext.Provider>
    </div>
  );
}

export default TranslateSource;
