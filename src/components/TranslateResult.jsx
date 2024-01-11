import { useState, useContext, useEffect } from "react";

//user-defined components
import TargetBar from "./TargetBar";
import TargetEditarea from "./TargetEditarea";
import TargetToolbar from "./TargetToolbar";
import { ResultContext, ResultsContext } from "./Context";
import propTypes from "prop-types";

function TranslateResult({ index }) {
  const { resultsConfig, updateResultsConfig } = useContext(ResultsContext);

  //define state for TranslateResult
  const [resultConfig, setResultConfig] = useState(resultsConfig[index]);

  //define functions for TranslateResult
  //update resultConfig
  const updateResultConfig = (key, value) => {
    console.log("update result config...");
    console.log("key: ", key, "value: ", value);
    setResultConfig((currentConfig) => ({ ...currentConfig, [key]: value }));
  };

  //update resultsConfig
  useEffect(() => {
    updateResultsConfig(index, resultConfig);
  }, [resultConfig, index, updateResultsConfig]);

  //render
  return resultConfig.isPower === true ? (
    <ResultContext.Provider
      value={{
        resultConfig: resultConfig,
        updateResultConfig: updateResultConfig,
      }}
    >
      <div className="PowerOn w-80 h-48 bg-white flex-col justify-center items-start flex">
        <TargetBar />
        <TargetEditarea />
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
