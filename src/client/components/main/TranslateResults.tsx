//import React from "react";
import { useContext } from "react";
import { TranslateContext } from "./Context";
//user-defined components
import TranslateResult from "./TranslateResult";

export function TranslateResults() {
  const { resultsConfig } = useContext(TranslateContext);
  return (
    <div className="Translateresults w-80 flex-col justify-center items-center gap-2 inline-flex">
      {resultsConfig.map((_, index: number) => (
        <TranslateResult key={index} index={index} />
      ))}
    </div>
  );
}

export default TranslateResults;
