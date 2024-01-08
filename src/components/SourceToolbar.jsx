import React from "react";

import Tools from "./Tools";

function SourceToolbar() {
  return (
    <div className="SourceToolbar w-80 h-9 pl-2 py-2 bg-background rounded-bl-md rounded-br-md border-2 border-black border-opacity-5 justify-between items-center inline-flex">
      <Tools />
      <div
        className="BtnTranslate w-28 h-9 p-2 bg-secondary hover:bg-secondaryGray rounded-br-lg border-2 border-zinc-300 justify-between items-center
      text-white font-bold cursor-pointer text-sm text-center"
      >
        Translate
      </div>
    </div>
  );
}

export default SourceToolbar;
