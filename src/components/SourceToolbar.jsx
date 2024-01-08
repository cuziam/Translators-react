import React from "react";

import Tools from "./Tools";

function SourceToolbar() {
  return (
    <div className="SourceToolbar w-80 h-9 pl-2 py-2 bg-background rounded-bl-md rounded-br-md border-2 border-black border-opacity-5 flex justify-between items-center">
      <Tools />
      <div className="BtnTranslate flex items-center justify-center w-28 h-9 bg-secondary hover:bg-secondaryGray rounded-br-lg border-2 border-zinc-300 text-white text-sm font-bold cursor-pointer">
        Translate
      </div>
    </div>
  );
}

export default SourceToolbar;
