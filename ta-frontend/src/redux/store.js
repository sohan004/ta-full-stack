import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};
