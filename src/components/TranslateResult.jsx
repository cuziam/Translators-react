import { useState, useContext, useEffect, useRef } from "react";

//user-defined components
import TargetBar from "./TargetBar";
import TargetEditarea from "./TargetEditarea";
import TargetToolbar from "./TargetToolbar";
import { ResultContext } from "./Context";
import propTypes from "prop-types";

function TranslateResult({ index, resultConfig }) {
  //util functions
  const editRef = useRef(null);
  const copyText = () => {
    console.log(editRef.current);
    const text = editRef.current.innerText;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };
  //~
  const isPower = resultConfig.isPower;
  //render
  return isPower === true ? (
    <div className="PowerOn w-80 h-48 bg-white flex-col justify-center items-start flex">
      <ResultContext.Provider
        value={{
          copyText: copyText,
        }}
      >
        <TargetBar isPower={isPower} />
        <TargetEditarea ref={editRef} />
        <TargetToolbar />{" "}
      </ResultContext.Provider>
    </div>
  ) : (
    <TargetBar />
  );
}

//prop-types
TranslateResult.propTypes = {
  index: propTypes.number.isRequired,
  resultConfig: propTypes.object.isRequired,
};

export default TranslateResult;
