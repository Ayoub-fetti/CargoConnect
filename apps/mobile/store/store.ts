import { configureStore } from '@reduxjs/toolkit';
import { authReducer, clearAuth } from '@/store/slices/authSlice';
import { setSessionExpiredHandler } from '@/services/auth-events';
import * as tokenStorage from '@/services/token-storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

setSessionExpiredHandler(() => {
  void tokenStorage.clearAll();
  store.dispatch(clearAuth());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
