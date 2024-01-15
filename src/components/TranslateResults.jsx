//import React from "react";
import React, { useContext } from "react";

//user-defined components
import TranslateResult from "./TranslateResult";
import propTypes from "prop-types";

export function TranslateResults({ resultsConfig }) {
  return (
    <div className="Translateresults w-80 flex-col justify-center items-center gap-2 inline-flex">
      {resultsConfig.map((_, index) => (
        <TranslateResult
          key={index}
          index={index}
          resultConfig={resultsConfig[index]}
        />
      ))}
    </div>
  );
}

propTypes.TranslateResults = {
  resultsConfig: propTypes.array.isRequired,
};

export default TranslateResults;
