import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";

export default function ServerStatus() {
  const { isConnected } = useSelector<RootState>((state) => state.app);
  const [showStatusMessage, setShowStatusMessage] = useState(true);
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    setShowStatusMessage(true);
    const timer = setTimeout(() => {
      setOpacity(0);
    }, 3000);
    return () => {
      clearTimeout(timer);
      setOpacity(1);
    };
  }, [isConnected]);

  return (
    <div className="inline-flex py-2">
      {isConnected ? (
        <>
          {showStatusMessage && (
            <div
              className="Connected text-text text-sm font-bold transition-opacity duration-1000"
              style={{ opacity }}
            >
              connected
            </div>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ServerStatus w-5 h-5"
            viewBox="0 0 32 32"
          >
            <title>Server status</title>
            <path
              className="fill-primary"
              d="M16 3C8.8 3 3 8.8 3 16s5.8 13 13 13s13-5.8 13-13c0-1.4-.188-2.794-.688-4.094L26.688 13.5c.2.8.313 1.6.313 2.5c0 6.1-4.9 11-11 11S5 22.1 5 16S9.9 5 16 5c3 0 5.694 1.194 7.594 3.094L25 6.688C22.7 4.388 19.5 3 16 3m11.28 4.28L16 18.563l-4.28-4.28l-1.44 1.437l5 5l.72.686l.72-.687l12-12l-1.44-1.44z"
            />
          </svg>
        </>
      ) : (
        <>
          {showStatusMessage && (
            <div
              className="Connected text-text text-sm font-bold transition-opacity duration-1000"
              style={{ opacity }}
            >
              disconnected
            </div>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ServerStatus w-5 h-5"
            viewBox="0 0 24 24"
          >
            <title>Server status</title>
            <path
              className="fill-danger"
              d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8"
            />
          </svg>
        </>
      )}
    </div>
  );
}
