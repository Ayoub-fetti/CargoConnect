import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  login,
  logout,
  initializeAuth,
  registerDriver,
  verifyEmail,
  forgotPassword,
  resetPassword,
  clearError,
} from '@/store/slices/authSlice';
import type { RegisterDriverBody } from '@/services/auth.service';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, status, bootstrapDone, error } = useAppSelector((s) => s.auth);

  const isAuthenticated = status === 'authenticated' && !!user;
  const isLoading =
    status === 'loading' || (status === 'idle' && !bootstrapDone);

  return {
    user,
    status,
    bootstrapDone,
    error,
    isAuthenticated,
    isLoading,
    clearError: useCallback(() => dispatch(clearError()), [dispatch]),
    initialize: useCallback(() => dispatch(initializeAuth()), [dispatch]),
    signIn: useCallback(
      (email: string, password: string) => dispatch(login({ email, password })),
      [dispatch],
    ),
    signOut: useCallback(() => dispatch(logout()), [dispatch]),
    signUpDriver: useCallback(
      (body: RegisterDriverBody) => dispatch(registerDriver(body)),
      [dispatch],
    ),
    confirmEmail: useCallback(
      (token: string) => dispatch(verifyEmail(token)),
      [dispatch],
    ),
    requestPasswordReset: useCallback(
      (email: string) => dispatch(forgotPassword(email)),
      [dispatch],
    ),
    setNewPassword: useCallback(
      (token: string, newPassword: string) =>
        dispatch(resetPassword({ token, newPassword })),
      [dispatch],
    ),
  };
}
