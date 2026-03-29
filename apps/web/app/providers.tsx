"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { setCredentials } from "../store/slices/authSlice";

function AuthRehydrator({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const raw = localStorage.getItem("user");
    if (accessToken && raw) {
      try {
        const user = JSON.parse(raw);
        store.dispatch(setCredentials({ accessToken, user }));
      } catch {}
    }
  }, []);
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRehydrator>{children}</AuthRehydrator>
    </Provider>
  );
}
