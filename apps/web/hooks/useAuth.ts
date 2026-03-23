import { useAppDispatch, useAppSelector } from '../store';
import { setCredentials, clearCredentials } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((s) => s.auth);

  const login = async (email: string, password: string) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    dispatch(setCredentials({ accessToken: data.accessToken, user: data.user }));
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(clearCredentials());
  };

  return { user, accessToken, isAuthenticated: !!accessToken, login, logout };
}
