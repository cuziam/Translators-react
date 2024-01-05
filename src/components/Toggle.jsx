import { useState, useContext } from "react";
import { Switch } from "@headlessui/react";
import { PowerContext } from "./Context";

function Toggle() {
  const isPowerOn = useContext(PowerContext);
  const [enabled, setEnabled] = useState(isPowerOn);

  return (
    <div className={"w-9 h-9 flex justify-center items-center"}>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled
            ? "bg-primary  hover:bg-dangerGray"
            : "bg-danger hover:bg-primaryGray"
        } relative inline-flex h-4 w-9 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            enabled ? "translate-x-5" : "translate-x-1"
          } inline-block h-3 w-3 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
}
export default Toggle;
