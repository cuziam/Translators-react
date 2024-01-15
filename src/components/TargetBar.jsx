import Toggle from "./Toggle";

//user-defined components
import Dropdowns from "./Dropdowns";
import propTypes from "prop-types";
function TargetBar({ isPower }) {
  let className;

  if (isPower === true) {
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

//prop-types
TargetBar.propTypes = {
  isPower: propTypes.bool,
};
export default TargetBar;
