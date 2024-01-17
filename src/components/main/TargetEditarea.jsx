import React from "react";

import { forwardRef } from "react";

const TargetEditarea = forwardRef(function targetEditarea(props, ref) {
  return (
    <p
      ref={ref}
      className="TargetEditarea w-80 h-32 p-2 bg-background border-l-2 border-r-2 border-black border-opacity-5 overflow-auto"
    >
      {props.targetText}
    </p>
  );
});

export default TargetEditarea;
