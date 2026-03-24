import { useAppDispatch, useAppSelector } from "../store";
import { setCredentials, clearCredentials } from "../store/slices/authSlice";
import { authService } from "../services/auth.service";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((s) => s.auth);

  const login = async (email: string, password: string): Promise<string> => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch(
      setCredentials({ accessToken: data.access_token, user: data.user }),
    );
    return data.user.role;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    dispatch(clearCredentials());
  };

  return { user, accessToken, isAuthenticated: !!accessToken, login, logout };
}
