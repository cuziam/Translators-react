import { useState, useContext, useEffect, useRef } from "react";

//user-defined components
import TargetBar from "./TargetBar";
import TargetEditarea from "./TargetEditarea";
import TargetToolbar from "./TargetToolbar";
import { TranslateContext, ResultContext } from "./Context";
import propTypes from "prop-types";

function TranslateResult({ index }) {
  const { initialResultsConfig, updateResultsConfig } =
    useContext(TranslateContext);

  //define state for TranslateResult
  const [resultConfig, setResultConfig] = useState(initialResultsConfig[index]);

  //define functions for TranslateResult
  //update resultConfig
  const updateResultConfig = (key, value) => {
    console.log("update result config...");
    console.log("key: ", key, "value: ", value);
    setResultConfig((currentConfig) => ({ ...currentConfig, [key]: value }));
  };

  //update resultsConfig(side effect)
  useEffect(() => {
    updateResultsConfig(index, resultConfig);
  }, [resultConfig]);

  //util functions
  const copyRef = useRef(null);
  const copyText = () => {
    console.log(copyRef.current);
    const text = copyRef.current.innerText;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  //render
  return resultConfig.isPower === true ? (
    <ResultContext.Provider
      value={{
        resultConfig: resultConfig,
        updateResultConfig: updateResultConfig,
        copyText: copyText,
      }}
    >
      <div className="PowerOn w-80 h-48 bg-white flex-col justify-center items-start flex">
        <TargetBar />
        <TargetEditarea ref={copyRef} />
        <TargetToolbar />
      </div>
    </ResultContext.Provider>
  ) : (
    <ResultContext.Provider
      value={{
        resultConfig: resultConfig,
        updateResultConfig: updateResultConfig,
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
