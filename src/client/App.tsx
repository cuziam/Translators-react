import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
//user-defined components
import Header from "./components/head/Header";
import Translate from "./components/main/Translate";
import AiChat from "./components/main/ai/AiChat";

function App() {
  const appUrl: string = import.meta.env.VITE_APP_URL;
  const webSocketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // webSocketRef.current가 null이거나 연결되지 않았다면 새로 연결
    if (!webSocketRef.current || !webSocketRef.current.connected) {
      // 서버에 연결 기다리기
      webSocketRef.current = io(`${appUrl}`);
      webSocketRef.current.on("connect", () => {
        console.log("서버에 연결되었습니다.");
        webSocketRef.current?.emit("connectAiChat");
        webSocketRef.current?.on("disconnect", () => {
          console.log("서버와의 연결이 끊어졌습니다.");
        });
      });
    }

    // 컴포넌트가 언마운트될 때 실행되는 정리(clean-up) 함수
    return () => {
      if (webSocketRef.current !== null) {
        webSocketRef.current.disconnect();
        webSocketRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div>
        <Header />
        <Translate webSocketRef={webSocketRef} />
        <AiChat webSocketRef={webSocketRef} />
      </div>
    </>
  );
}

export default App;
