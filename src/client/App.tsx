import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
//user-defined components
import Header from "./components/head/Header";
import Translate from "./components/main/Translate";
import AiChat from "./components/main/ai/AiChat";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { appSliceActions } from "./store/app-slice";

function App() {
  const appUrl: string = import.meta.env.VITE_APP_URL;
  const webSocketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // webSocketRef.current가 null이거나 연결되지 않았다면 새로 연결
    if (!webSocketRef.current || !webSocketRef.current.connected) {
      // 서버에 연결 기다리기
      webSocketRef.current = io(`${appUrl}`);
      webSocketRef.current.on("connect", () => {
        console.log("서버에 연결되었습니다.");
        dispatch(appSliceActions.updateIsConnected(true));
        webSocketRef.current?.emit("connectAiChat");
        webSocketRef.current?.on("disconnect", () => {
          console.log("서버와의 연결이 끊어졌습니다.");
          dispatch(appSliceActions.updateIsConnected(false));
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
      <BrowserRouter>
        <div>
          <Routes>
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <Translate webSocketRef={webSocketRef} />
                  <Outlet />
                </>
              }
            >
              <Route
                path="aichat"
                element={<AiChat webSocketRef={webSocketRef} />}
              />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
