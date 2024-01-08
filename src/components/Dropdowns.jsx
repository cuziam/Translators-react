import React from "react";
import Dropdown from "./Dropdown";
import supported from "../data/supported.json"; //수정 필요: db에서 받아오거나, 코드 내에서 처리할 것

function Dropdowns() {
  console.log(supported);
  const tools = supported.supportedTools.sort();
  const targetLanguages = supported.deepLSupportedLangs.targetLangs.sort();
  return (
    <div className="Dropdowns w-[260px] h-9 justify-start items-center inline-flex overflow-x-visible text-ellipsis">
      <Dropdown optionsName="tools" options={tools} />
      <Dropdown optionsName="targetLanguages" options={targetLanguages} />
    </div>
  );
}

export default Dropdowns;
