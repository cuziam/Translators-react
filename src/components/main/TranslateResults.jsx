//import React from "react";

//user-defined components
import TranslateResult from "./TranslateResult";

//prop-types
import propTypes from "prop-types";

export function TranslateResults({ initialResultsConfig }) {
  return (
    <div className="Translateresults w-80 flex-col justify-center items-center gap-2 inline-flex">
      {initialResultsConfig.map((_, index) => (
        <TranslateResult key={index} index={index} />
      ))}
    </div>
  );
}

TranslateResults.propTypes = {
  initialResultsConfig: propTypes.array,
};

export default TranslateResults;
