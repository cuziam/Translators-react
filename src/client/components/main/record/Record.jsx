import { useState, useRef } from "react";

const Transcript = ({ webSocketRef }) => {
  if (!webSocketRef) {
    console.log("webSocketRef is not defined");
  }
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스를 저장하기 위한 ref

  //최대한 단순하게 구현할 것.
  const startRecord = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder; // 현재 MediaRecorder 인스턴스를 ref에 저장
      let audioChunks = [];

      mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.start();

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioArrayBuffer = await audioBlob.arrayBuffer();
        webSocketRef.current.emit(
          "transcript",
          audioArrayBuffer,
          (response) => {
            console.log("transcript response:", response);
          }
        );
      };
    });
  };

  const stopRecord = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // MediaRecorder 인스턴스의 stop 메소드 호출로 녹음 중지
    }
  };

  return (
    <>
      <div className="flex sticky bottom-0 pt-6 pb-12 shadow-md justify-center items-center bg-gray-200 dark:bg-gray-800">
        {isRecording === true ? (
          <button
            className="block"
            onClick={() => {
              setIsRecording(false);
              // stopRecord();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.0"
              className="start group w-20 h-20 rounded-full bg-red-500 ring-inset ring-4 ring-primary animate-spin2 active:ring-gray-700 dark:active:ring-white"
              viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                className="animate-pulse "
                stroke="none"
              >
                <path d="M2500 4969 c-68 -13 -184 -74 -221 -116 -31 -36 -38 -38 -169 -65 -857 -172 -1549 -832 -1760 -1678 -50 -200 -64 -323 -64 -555 0 -385 70 -687 239 -1020 564 -1118 1908 -1574 3030 -1029 675 327 1146 971 1262 1724 24 159 24 491 0 650 -142 921 -804 1655 -1698 1884 -126 32 -129 34 -176 84 -99 105 -276 154 -443 121z m252 -114 c60 -21 76 -41 25 -31 -19 4 -109 7 -199 7 -169 0 -179 5 -76 34 65 18 183 14 250 -10z m27 -271 c74 -8 69 -22 -17 -54 -72 -27 -164 -35 -232 -21 -61 13 -160 57 -160 72 0 10 314 12 409 3z m-502 -54 c47 -55 160 -109 257 -123 144 -21 300 22 395 108 l42 38 57 -13 c105 -23 289 -88 404 -142 211 -101 368 -210 541 -377 326 -315 524 -694 604 -1156 24 -139 24 -481 0 -620 -39 -226 -98 -407 -194 -600 -300 -601 -879 -1017 -1542 -1109 -146 -21 -416 -21 -562 0 -663 92 -1242 508 -1542 1109 -96 193 -155 374 -194 600 -12 73 -17 157 -17 310 0 277 33 469 120 703 242 649 791 1130 1468 1287 56 13 107 24 115 24 8 1 29 -17 48 -39z" />
              </g>
            </svg>
            <div className="absolute mt-1 font-sans font-bold">
              recording...
            </div>
          </button>
        ) : (
          <button
            className="block"
            onClick={() => {
              setIsRecording(true);
              // startRecord();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.0"
              className="start group w-20 h-20 rounded-full bg-red-500 ring-inset ring-4 ring-gray-700 dark:ring-white active:ring-primary"
              viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path d="M2425 4829 c-805 -43 -1531 -522 -1900 -1254 -169 -333 -239 -635 -239 -1020 0 -385 70 -687 239 -1020 564 -1118 1908 -1574 3030 -1029 675 327 1146 971 1262 1724 24 159 24 491 0 650 -104 675 -482 1250 -1062 1615 -299 188 -694 315 -1030 331 -60 3 -123 6 -140 7 -16 2 -88 0 -160 -4z m416 -255 c664 -92 1242 -509 1542 -1109 96 -192 155 -374 194 -600 24 -139 24 -481 0 -620 -39 -226 -98 -407 -194 -600 -300 -601 -879 -1017 -1542 -1109 -146 -21 -416 -21 -562 0 -663 92 -1242 508 -1542 1109 -96 193 -155 374 -194 600 -12 73 -17 157 -17 310 0 224 11 316 59 508 127 502 466 959 916 1233 233 142 501 239 769 278 134 19 433 20 571 0z" />
              </g>
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default Transcript;
