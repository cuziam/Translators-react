import { forwardRef, useState, useContext, useEffect } from "react";
import { SourceContext } from "./Context";

const SourceEditarea = forwardRef(function SourceEditarea(props, ref) {
  const [currentLength, setCurrentLength] = useState(0);

  //util functions
  //textarea의 길이가 변경될 때마다 길이를 업데이트하는 함수
  const onChangeHandler = (e) => {
    setCurrentLength(e.target.value.length);
  };

  return (
    <>
      <textarea
        ref={ref}
        className="SourceEditarea w-80 h-36 p-2 bg-background border-2 border-black border-opacity-5 text-sans text-base overflow-auto 
      resize-none focus:ring-0 focus:outline-none focus:border-primary"
        placeholder="Please enter what you want to translate..."
        maxLength="1500"
        onChange={(e) => {
          onChangeHandler(e);
        }}
      ></textarea>
      <p className="absolute text-[8px] right-3 bottom-10">
        {currentLength}/1500
      </p>
    </>
  );
});

export default SourceEditarea;
