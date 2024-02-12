import { useState, useRef } from "react";

const Transcript = ({ webSocketRef }) => {
  if (!webSocketRef) {
    console.log("webSocketRef is not defined");
  }
  const [shouldTranscript, setShouldTranscript] = useState(false);
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
      <div className="flex h-36 w-36 animate-wave">
        <button className="h-24 w-24 bg-primary" onClick={startRecord}>
          start
        </button>
        <button className="h-24 w-24 bg-danger" onClick={stopRecord}>
          stop
        </button>
      </div>
    </>
  );
};

export default Transcript;
