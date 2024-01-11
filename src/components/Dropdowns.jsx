import { useContext } from "react";
import Dropdown from "./Dropdown";
import { resultContext } from "./Context";

function Dropdowns() {
  const resultContextValue = useContext(resultContext);
  const tools = resultContextValue.resultConfig.supportedTools;
  const targetLanguages = resultContextValue.resultConfig.supportedLangs;

  return (
    <div className="Dropdowns w-[260px] h-9 justify-start items-center inline-flex overflow-x-visible text-ellipsis">
      <Dropdown optionsName="tools" options={tools} />
      <Dropdown optionsName="targetLanguages" options={targetLanguages} />
    </div>
  );
}

export default Dropdowns;
