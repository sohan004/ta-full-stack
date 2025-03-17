"use client";

import axiosInstance from "@/axios/axiosInstance";
import { setUser } from "@/redux/slice/authSlice";
import { makeStore } from "@/redux/store";
import { useRef, useEffect } from "react";
import { Provider } from "react-redux";

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore(); // Fallback during SSR to avoid errors
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
