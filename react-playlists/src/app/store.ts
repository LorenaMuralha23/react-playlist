import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import playlistReducer from "../features/playlist/playlistSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playlist: playlistReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

