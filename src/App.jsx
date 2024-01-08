import React from "react";

//user-defined components
import TranslateResults from "./components/TranslateResults";
import TranslateSource from "./components/TranslateSource";
function App() {
  return (
    <>
      <div className="Translate w-96 p-2 flex-col justify-center items-center gap-2 flex">
        <TranslateSource />
        <TranslateResults />
      </div>
    </>
  );
}

export default App;
