import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService, LoginDto, RegisterDriverDto } from '@/services/auth.service';
import { tokenStorage } from '@/services/api';
import { missionsReducer } from '@/store/missionStore';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthUser {
  id: string;
  email: string;
  role: 'DRIVER' | 'COMPANY' | 'ADMIN';
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: 'idle',
  error: null,
};

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const [accessToken, refreshToken, userRaw] = await Promise.all([
    AsyncStorage.getItem(tokenStorage.keys.ACCESS_TOKEN_KEY),
    AsyncStorage.getItem(tokenStorage.keys.REFRESH_TOKEN_KEY),
    AsyncStorage.getItem(tokenStorage.keys.USER_KEY),
  ]);

  const user = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
  if (accessToken) {
    await tokenStorage.setAccessToken(accessToken);
  }

  return { accessToken, refreshToken, user };
});

export const login = createAsyncThunk('auth/login', async (payload: LoginDto) => {
  const data = await authService.login(payload);

  await Promise.all([
    tokenStorage.setAccessToken(data.access_token),
    tokenStorage.setRefreshToken(data.refresh_token),
    tokenStorage.setUser(data.user),
  ]);

  return data;
});

export const registerDriver = createAsyncThunk(
  'auth/registerDriver',
  async (payload: RegisterDriverDto) => authService.registerDriver(payload)
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } finally {
    await tokenStorage.clearAll();
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFromTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: AuthUser }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.status = 'authenticated';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.status = action.payload.accessToken ? 'authenticated' : 'unauthenticated';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      });
  },
});

export const { setAuthFromTokens } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    missions: missionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;