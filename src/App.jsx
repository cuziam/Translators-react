import React from "react";

//user-defined components
import Translate from "./components/main/Translate";
import Header from "./components/head/Header";
function App() {
  return (
    <>
      <body className="dark:bg-disabled">
        <Header />
        <Translate />
      </body>
    </>
  );
}

export default App;
