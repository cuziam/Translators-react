import { forwardRef } from "react";

const SourceEditarea = forwardRef(function SourceEditarea(props, ref) {
  return (
    <>
      <textarea
        ref={ref}
        className="SourceEditarea w-80 h-36 p-2 bg-background border-2 border-black border-opacity-5 text-sans text-base overflow-auto 
      resize-none focus:ring-0 focus:outline-none focus:border-primary"
        placeholder="Please enter what you want to translate..."
      ></textarea>
      <p className="absolute text-[8px] right-3 bottom-10">0/1500</p>
    </>
  );
});

export default SourceEditarea;
