import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
//user-defined components
import Header from "./components/head/Header";
import Translate from "./components/main/Translate";
import AiChat from "./components/main/ai/AiChat";
import Transcript from "./components/main/transcript/Transcript";
import { AppContext } from "./components/main/Context";

function App() {
  const webSocketRef = useRef(null);
  const [shouldAiChatOpen, setShouldAiChatOpen] = useState(false);
  const [shouldTranscript, setShouldTranscript] = useState(false);
  const updateShouldAiChatOpen = (value) => {
    setShouldAiChatOpen(value);
  };

  useEffect(() => {
    // webSocketRef.current가 null이거나 연결되지 않았다면 새로 연결
    if (!webSocketRef.current || !webSocketRef.current.connected) {
      webSocketRef.current = io(`${import.meta.env.VITE_APP_URL}`);

      webSocketRef.current.on("connect", () => {
        console.log("서버에 연결되었습니다.");
        webSocketRef.current.emit("connectAiChat");
        webSocketRef.current.on("disconnect", () => {
          console.log("서버와의 연결이 끊어졌습니다.");
        });
      });
    }

    // 컴포넌트가 언마운트될 때 실행되는 정리(clean-up) 함수
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
        webSocketRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div>
        <Header />{" "}
        <AppContext.Provider value={{ updateShouldAiChatOpen }}>
          <Translate webSocketRef={webSocketRef} />
        </AppContext.Provider>
        <AiChat
          webSocketRef={webSocketRef}
          shouldAiChatOpen={shouldAiChatOpen}
          updateShouldAiChatOpen={updateShouldAiChatOpen}
        />
        <div
          onClick={() => setShouldTranscript(!shouldTranscript)}
          className="w-6 h-6 bg-secondary"
        ></div>
        {shouldTranscript ? (
          <Transcript webSocketRef={webSocketRef}></Transcript>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

export default App;
