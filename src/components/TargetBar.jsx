import Toggle from "./Toggle";

//user-defined components
import { useContext } from "react";
import Dropdowns from "./Dropdowns";
import { PowerContext } from "./Context";

function TargetBar() {
  const { power } = useContext(PowerContext);
  let className;

  if (power === true) {
    className =
      "Targetbar w-80 h-9 px-2 bg-background rounded-tl-md rounded-tr-md border-2 border-black border-opacity-5 justify-between items-center inline-flex";
  } else {
    className =
      "TargetBar w-80 h-9 px-2 bg-background rounded-md border-2 border-black border-opacity-5 justify-between items-center inline-flex";
  }

  return (
    <div className={className}>
      <Dropdowns />
      <Toggle />
    </div>
  );
}
export default TargetBar;
