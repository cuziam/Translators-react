import { createSlice } from "@reduxjs/toolkit";

const websocketSlice = createSlice({
  name: "websocket",
  initialState: {
    isConnected: false,
  },
  reducers: {
    connectWebSocket: (url) => {},
    disconnectWebSocket: (state) => {
      state.isConnected = false;
    },
  },
});
