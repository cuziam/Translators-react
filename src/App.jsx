import React from "react";

//user-defined components
import Dropdowns from "./components/Dropdowns";
import Toggle from "./components/Toggle";
import TranslateResult from "./components/TranslateResult";
function App() {
  return (
    <>
      <Dropdowns />
      <Toggle />
      <TranslateResult isPowerOn={false} />
    </>
  );
}

export default App;
