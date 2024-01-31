import { forwardRef, useState, useContext, useEffect } from "react";
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
  // useRef를 사용하여 초기 마운트 여부를 추적

  useEffect(() => {
    if (currentLength > 0) {
      // 그 후의 렌더링에서 디바운싱 로직 실행
      const debounce = setTimeout(() => {
        updateSourceText();
        updateShouldTranslate(true);
      }, 1000);

      return () => clearTimeout(debounce);
    }
  }, [currentLength, updateSourceText, updateShouldTranslate]);

  return (
    <>
      <textarea
        ref={ref}
        className="SourceEditarea w-80 h-36 p-2 bg-background border-2 border-black border-opacity-5 text-sans text-base overflow-auto 
      resize-none focus:ring-0 focus:outline-none focus:border-primary"
        placeholder="Please enter what you want to translate..."
        maxLength={1000}
        onChange={(e) => {
          onChangeHandler(e);
        }}
        required={true}
      ></textarea>
      <p className="absolute text-[8px] right-3 bottom-10">
        {currentLength}/1000
      </p>
    </>
  );
});

export default SourceEditarea;
