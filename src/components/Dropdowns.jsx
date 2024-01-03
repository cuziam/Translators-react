import React from "react";
import Dropdown from "./Dropdown";
import supported from "../data/supported.json";

function Dropdowns() {
  console.log(supported);
  const toolList = supported.supportedTools.sort();
  const languageList = supported.deepLSupportedLangs.targetLangs.sort();
  return (
    <>
      <Dropdown optionsName="Tools" options={toolList} />
      <Dropdown optionsName="Languages" options={languageList} />
    </>
  );
}

export default Dropdowns;
