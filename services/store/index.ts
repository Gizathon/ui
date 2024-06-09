import tokenSlice from "../slices/tokenSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    token: tokenSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
