import { forwardRef, useState, useContext, useEffect, useRef } from "react";
import { SourceContext, TranslateContext } from "./Context";

interface SourceEditareaProps {
  editareaValue: string;
  updateEditareaValue: (text: string) => void;
}

const SourceEditarea = ({
  editareaValue,
  updateEditareaValue,
}: SourceEditareaProps) => {
  return (
    <>
      <textarea
        className="SourceEditarea w-80 h-36 p-2 bg-background border-2 border-black border-opacity-5 text-sans text-base overflow-auto 
      resize-none focus:ring-0 focus:outline-none focus:border-primary"
        placeholder="Please enter what you want to translate..."
        value={editareaValue}
        maxLength={1000}
        onChange={(e) => {
          updateEditareaValue(e.target.value);
        }}
        required={true}
        data-testid="sourceEditarea"
      ></textarea>
      <p className="absolute text-[8px] right-3 bottom-10">
        {editareaValue.length}/1000
      </p>
    </>
  );
};

export default SourceEditarea;
