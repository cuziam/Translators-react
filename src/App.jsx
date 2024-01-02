import React from "react";

//user defined components
import Dropdown from "./components/Dropdown";

function App() {
  return <Dropdown optionsName="Languages " options={["korean", "japanese"]} />;
}

export default App;
