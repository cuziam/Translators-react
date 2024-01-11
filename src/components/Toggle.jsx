import { useContext } from "react";
import { Switch } from "@headlessui/react";
import { resultContext } from "./Context";

function Toggle() {
  const { isPower } = useContext(resultContext).resultConfig;
  const { updateResultConfig } = useContext(resultContext);
  console.log("isPower:", isPower);
  return (
    <div className={"w-9 h-9 ml-1 flex justify-center items-center"}>
      <Switch
        checked={isPower}
        onChange={() => updateResultConfig("isPower", !isPower)}
        className={`${
          isPower
            ? "bg-primary  hover:bg-dangerGray"
            : "bg-danger hover:bg-primaryGray"
        } relative inline-flex h-4 w-9 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            isPower ? "translate-x-5" : "translate-x-1"
          } inline-block h-3 w-3 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
}
export default Toggle;
