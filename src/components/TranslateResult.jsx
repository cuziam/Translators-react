import React, { createContext, useState } from "react";

//user-defined components
import TargetBar from "./TargetBar";
import Editarea from "./Editarea";
import TargetToolbar from "./TargetToolbar";
import { PowerContext } from "./Context";

export default function TranslateResult({ isPowerOn }) {
  return isPowerOn === true ? (
    <PowerContext.Provider value={isPowerOn}>
      <TargetBar />
      <Editarea />
      <TargetToolbar />
    </PowerContext.Provider>
  ) : (
    <PowerContext.Provider value={isPowerOn}>
      <TargetBar />
    </PowerContext.Provider>
  );
}
