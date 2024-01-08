import React from "react";

//user-defined components
import Dropdown from "./Dropdown";
import supported from "../data/supported.json";

export default function SourceBar() {
  const srcLanguages = supported.deepLSupportedLangs.srcLangs.sort();
  return (
    <div className="w-80 h-9 px-2 bg-background rounded-tl-md rounded-tr-md border-2 border-black border-opacity-5 justify-start items-center inline-flex">
      <Dropdown optionsName="srcLanguages" options={srcLanguages} />
    </div>
  );
}
