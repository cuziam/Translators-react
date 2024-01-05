import React from "react";
import Dropdown from "./Dropdown";
import supported from "../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것

function Dropdowns() {
  console.log(supported);
  const toolList = supported.supportedTools.sort();
  const languageList = supported.deepLSupportedLangs.targetLangs.sort();
  return (
    <div className="Dropdowns h-9 justify-start items-center inline-flex">
      <Dropdown optionsName="Tools" options={toolList} />
      <Dropdown optionsName="Languages" options={languageList} />
    </div>
  );
}

export default Dropdowns;
