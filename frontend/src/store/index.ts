import { configureStore } from "@reduxjs/toolkit";

import appSlice from "./app-slice";
import translateSlice from "./translate-slice";
const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    translate: translateSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
