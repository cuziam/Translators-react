import React, { useContext } from "react";
import { TranslateContext } from "./Context";
//user-defined components
import Dropdown from "./Dropdown";

export default function SourceBar() {
  const {
    sourceConfig: { sourceLang, supportedLangs },
    updateSourceConfig,
  } = useContext(TranslateContext);

  return (
    <div className="w-80 h-9 px-2 bg-background rounded-tl-md rounded-tr-md border-2 border-black border-opacity-5 justify-start items-center inline-flex">
      <Dropdown
        optionsName="sourceLang"
        options={supportedLangs}
        initialOption={sourceLang}
        updateConfig={updateSourceConfig}
      />
    </div>
  );
}
