import React, { useContext } from "react";

import { forwardRef } from "react";
import { ResultContext } from "./Context";

const TargetEditarea = forwardRef(function targetEditarea(props, ref) {
  const { resultConfig } = useContext(ResultContext);
  return (
    <p
      ref={ref}
      className="TargetEditarea w-80 h-32 p-2 bg-background border-l-2 border-r-2 border-black border-opacity-5 overflow-auto"
    >
      {props.targetText}
      {resultConfig.isLoading ? "..." : ""}
    </p>
  );
});

export default TargetEditarea;
