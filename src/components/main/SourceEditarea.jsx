import { forwardRef, useState, useContext, useEffect, useRef } from "react";
import { SourceContext, TranslateContext } from "./Context";

const SourceEditarea = forwardRef(function SourceEditarea(props, ref) {
  const { updateSourceText } = useContext(SourceContext);
  const { updateShouldTranslate } = useContext(TranslateContext);

  const [currentLength, setCurrentLength] = useState(0);

  //util functions
  //textarea의 길이가 변경될 때마다 길이를 업데이트하는 함수
  const onChangeHandler = (e) => {
    setCurrentLength(e.target.value.length);
  };

  //번역 요청 디바운싱
  const previousLengthRef = useRef(null); // 이전 길이를 추적하기 위한 ref
  useEffect(() => {
    // 첫 번째 렌더링에서는 이전 길이가 null이므로 아무 것도 하지 않음
    if (previousLengthRef.current === null) {
      previousLengthRef.current = currentLength;
    } else {
      // 그 외의 경우에는 디바운싱 로직 실행
      if (previousLengthRef.current !== currentLength) {
        const debounce = setTimeout(() => {
          updateSourceText();
          updateShouldTranslate(true);
        }, 1200);

        // 이전 길이를 현재 길이로 업데이트
        previousLengthRef.current = currentLength;

        return () => clearTimeout(debounce);
      }
    }
  }, [currentLength, updateSourceText, updateShouldTranslate]);

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
