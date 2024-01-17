import { useState, useContext, useEffect, useRef } from "react";

//user-defined components
import TargetBar from "./TargetBar";
import TargetEditarea from "./TargetEditarea";
import TargetToolbar from "./TargetToolbar";
import { TranslateContext, ResultContext } from "./Context";
import propTypes from "prop-types";

function TranslateResult({ index }) {
  //define state for TranslateResult
  const { resultsConfig, updateResultsConfig } = useContext(TranslateContext);

  //util functions
  const copyRef = useRef(null);
  const copyText = () => {
    console.log(copyRef.current);
    const text = copyRef.current.innerText;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

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
      }}
    >
      <div className="PowerOn w-80 h-48 bg-white flex-col justify-center items-start flex">
        <TargetBar />
        <TargetEditarea
          ref={copyRef}
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
