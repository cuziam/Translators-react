import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  isConnected: boolean;
}

const appSlice = createSlice({
  name: "app",
  initialState: {
    isConnected: false,
  } as AppState,
  reducers: {
    updateIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

// //thunk
// const connectToServer = (appUrl: string) => {
//   return async (dispatch: Dispatch) => {
//     try {
//       if (!appUrl) return;
//       const webSocket = io(appUrl);
//       webSocket.on("connect", () => {
//         console.log("connected to server");
//         dispatch(appSliceActions.updateIsConnected(true));
//         dispatch(appSliceActions.updateWebSocket({ webSocket }));
//         webSocket.emit("connectAiChat");
//         webSocket.on("disconnect", () => {
//           console.log("disconnected from server");
//           dispatch(appSliceActions.updateIsConnected(false));
//         });
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

// const disconnectFromServer = () => {
//   return async (dispatch: Dispatch, getState: () => AppState) => {
//     const webSocket = getState().app.webSocket;
//     if (webSocket) {
//       webSocket.disconnect();
//       dispatch(appSliceActions.updateIsConnected(false));
//     }
//   };
// };

// export const appThunkActions = { connectToServer, disconnectFromServer };
export const appSliceActions = appSlice.actions;
export default appSlice;
