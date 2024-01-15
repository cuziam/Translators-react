import { useContext } from "react";
import { SourceContext, ResultContext } from "./Context";

function Tools() {
  //상위 컴포넌트가 SourceContext.Provider인 경우와 ResultContext.Provider인 경우를 구분하여 Context를 가져온다.
  let context;
  if (useContext(SourceContext) !== undefined) {
    context = useContext(SourceContext);
  } else {
    context = useContext(ResultContext);
  }

  return (
    <div className="Tools w-14 h-6 justify-start items-center gap-2 inline-flex">
      <svg
        viewBox="0 0 31 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group w-6 h-6"
        onClick={() => context.copyText()}
      >
        <g id="icon-copy">
          <path
            id="Vector"
            d="M23 2.5H11.75C10.375 2.5 9.25 3.625 9.25 5V20C9.25 21.375 10.375 22.5 11.75 22.5H23C24.375 22.5 25.5 21.375 25.5 20V5C25.5 3.625 24.375 2.5 23 2.5ZM23 20H11.75V5H23V20ZM4.25 18.75V16.25H6.75V18.75H4.25ZM4.25 11.875H6.75V14.375H4.25V11.875ZM13 25H15.5V27.5H13V25ZM4.25 23.125V20.625H6.75V23.125H4.25ZM6.75 27.5C5.375 27.5 4.25 26.375 4.25 25H6.75V27.5ZM11.125 27.5H8.625V25H11.125V27.5ZM17.375 27.5V25H19.875C19.875 26.375 18.75 27.5 17.375 27.5ZM6.75 7.5V10H4.25C4.25 8.625 5.375 7.5 6.75 7.5Z"
            fill="#525252"
            className="group-hover:fill-primary"
          />
        </g>
      </svg>
      <svg
        viewBox="0 0 31 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group w-6 h-6"
      >
        <path
          id="history"
          d="M15.5 30C11.6667 30 8.32639 28.7292 5.47917 26.1875C2.63194 23.6458 1 20.4722 0.583333 16.6667H4C4.38889 19.5556 5.67361 21.9444 7.85417 23.8333C10.0347 25.7222 12.5833 26.6667 15.5 26.6667C18.75 26.6667 21.5069 25.5347 23.7708 23.2708C26.0347 21.0069 27.1667 18.25 27.1667 15C27.1667 11.75 26.0347 8.99306 23.7708 6.72917C21.5069 4.46528 18.75 3.33333 15.5 3.33333C13.5833 3.33333 11.7917 3.77778 10.125 4.66667C8.45833 5.55556 7.05556 6.77778 5.91667 8.33333H10.5V11.6667H0.5V1.66667H3.83333V5.58333C5.25 3.80556 6.97917 2.43056 9.02083 1.45833C11.0625 0.486111 13.2222 0 15.5 0C17.5833 0 19.5347 0.395833 21.3542 1.1875C23.1736 1.97917 24.7569 3.04861 26.1042 4.39583C27.4514 5.74306 28.5208 7.32639 29.3125 9.14583C30.1042 10.9653 30.5 12.9167 30.5 15C30.5 17.0833 30.1042 19.0347 29.3125 20.8542C28.5208 22.6736 27.4514 24.2569 26.1042 25.6042C24.7569 26.9514 23.1736 28.0208 21.3542 28.8125C19.5347 29.6042 17.5833 30 15.5 30ZM20.1667 22L13.8333 15.6667V6.66667H17.1667V14.3333L22.5 19.6667L20.1667 22Z"
          fill="#525252"
          className="group-hover:fill-primary"
        />
      </svg>
    </div>
  );
}
export default Tools;