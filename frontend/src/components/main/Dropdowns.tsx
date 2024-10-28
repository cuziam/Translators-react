import { useContext } from "react";
import Dropdown from "./Dropdown";
import { ResultContext } from "./Context";

function Dropdowns() {
  const {
    resultConfig: { targetTool, targetLang, supportedTools, supportedLangs },
    updateResultConfig,
  } = useContext(ResultContext);

  return (
    <div className="Dropdowns w-[260px] h-9 justify-start items-center inline-flex overflow-x-visible text-ellipsis">
      <Dropdown
        optionsName="targetTool"
        options={supportedTools}
        initialOption={targetTool}
        updateConfig={updateResultConfig}
      />
      <Dropdown
        optionsName="targetLang"
        options={supportedLangs}
        initialOption={targetLang}
        updateConfig={updateResultConfig}
      />
    </div>
  );
}

export default Dropdowns;
