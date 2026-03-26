import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/authStore';
import { hydrateAuth, login, logout, registerDriver } from '@/store/authStore';
import { LoginDto, RegisterDriverDto } from '@/services/auth.service';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.status === 'idle') {
      dispatch(hydrateAuth());
    }
  }, [auth.status, dispatch]);

  return {
    auth,
    isAuthenticated: auth.status === 'authenticated' && !!auth.accessToken && !!auth.user,
    login: (payload: LoginDto) => dispatch(login(payload)),
    registerDriver: (payload: RegisterDriverDto) => dispatch(registerDriver(payload)),
    logout: () => dispatch(logout()),
  };
}