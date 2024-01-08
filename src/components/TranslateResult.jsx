import { useState } from "react";

//user-defined components
import TargetBar from "./TargetBar";
import TargetEditarea from "./TargetEditarea";
import TargetToolbar from "./TargetToolbar";
import { PowerContext } from "./Context";
import propTypes from "prop-types";

function TranslateResult({ isPowerOn }) {
  const [power, setPower] = useState(isPowerOn);

  return power === true ? (
    <PowerContext.Provider value={{ power, setPower }}>
      <div className="PowerOn w-80 h-48 bg-white flex-col justify-center items-start flex">
        <TargetBar />
        <TargetEditarea />
        <TargetToolbar />
      </div>
    </PowerContext.Provider>
  ) : (
    <PowerContext.Provider value={{ power, setPower }}>
      <TargetBar />
    </PowerContext.Provider>
  );
}

TranslateResult.propTypes = {
  isPowerOn: propTypes.bool,
};

export default TranslateResult;
