import { useState } from "react";

//user-defined components
import TargetBar from "./TargetBar";
import TargetEditarea from "./TargetEditarea";
import TargetToolbar from "./TargetToolbar";
import { resultContext } from "./Context";
import propTypes from "prop-types";

//data
import supported from "../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것

function TranslateResult({ isPowerOn }) {
  //define initial state
  const initialResultConfig = {
    isPower: isPowerOn,
    targetLang: "Korean",
    targetTool: "Papago",
    targetText: "",
    supportedTools: supported.supportedTools.sort(),
    supportedLangs: supported.deepLSupportedLangs.srcLangs.sort(),
    isLoading: false,
  };

  //define state for TranslateResult
  const [resultConfig, setResultConfig] = useState(initialResultConfig);
  const updateResultConfig = (key, value) => {
    console.log("update result config...");
    setResultConfig({ ...resultConfig, [key]: value });
  };

  //render
  return resultConfig.isPower === true ? (
    <resultContext.Provider
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
    </resultContext.Provider>
  ) : (
    <resultContext.Provider
      value={{
        resultConfig: resultConfig,
        updateResultConfig: updateResultConfig,
      }}
    >
      <TargetBar />
    </resultContext.Provider>
  );
}

//prop-types
TranslateResult.propTypes = {
  isPowerOn: propTypes.bool.isRequired,
  resultConfig: propTypes.shape({
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
