import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  shouldAiChatOpen: boolean;
}

const appSlice = createSlice({
  name: "app",
  initialState: {
    shouldAiChatOpen: false,
  } as AppState,
  reducers: {
    updateShouldAiChatOpen: (state, action) => {
      state.shouldAiChatOpen = action.payload;
    },
  },
});

export const appSliceActions = appSlice.actions;
export default appSlice;
