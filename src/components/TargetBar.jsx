import Toggle from "./Toggle";

//user-defined components
import React from "react";
import Dropdowns from "./Dropdowns";

function TargetBar() {
  return (
    <div>
      <div className="Targetbar w-80 h-9 px-2 bg-background rounded-tl-md rounded-tr-md border-2 border-black border-opacity-5 justify-between items-center inline-flex">
        <Dropdowns />
        <Toggle />
      </div>
    </div>
  );
}
export default TargetBar;
