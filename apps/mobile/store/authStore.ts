import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
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

function parseErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'string' && data.trim().length > 0) {
    return data;
  }

  if (Array.isArray(data)) {
    const parts = data
      .map((value) => parseErrorMessage(value, ''))
      .filter((value) => value.trim().length > 0);
    if (parts.length > 0) {
      return parts.join(', ');
    }
  }

  if (data && typeof data === 'object') {
    const payload = data as {
      message?: unknown;
      error?: unknown;
      statusCode?: unknown;
    };

    if (payload.message !== undefined) {
      const nestedMessage = parseErrorMessage(payload.message, '');
      if (nestedMessage.trim().length > 0) {
        return nestedMessage;
      }
    }

    if (typeof payload.error === 'string' && payload.error.trim().length > 0) {
      return payload.error;
    }
  }

  return fallback;
}

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const [accessToken, refreshToken, userRaw] = await Promise.all([
    AsyncStorage.getItem(tokenStorage.keys.ACCESS_TOKEN_KEY),
    AsyncStorage.getItem(tokenStorage.keys.REFRESH_TOKEN_KEY),
    AsyncStorage.getItem(tokenStorage.keys.USER_KEY),
  ]);

  let user: AuthUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as AuthUser;
    } catch {
      // Corrupted persisted user payload should not block app startup.
      await AsyncStorage.removeItem(tokenStorage.keys.USER_KEY);
      user = null;
    }
  }

  if (accessToken) {
    await tokenStorage.setAccessToken(accessToken);
  }

  // If cache is inconsistent, force logout state and clear persisted tokens.
  if ((accessToken || refreshToken) && !user) {
    await tokenStorage.clearAll();
    return { accessToken: null, refreshToken: null, user: null };
  }

  return { accessToken, refreshToken, user };
});

export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginDto, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);

      await Promise.all([
        tokenStorage.setAccessToken(data.access_token),
        tokenStorage.setRefreshToken(data.refresh_token),
        tokenStorage.setUser(data.user),
      ]);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          return rejectWithValue(
            'Cannot reach API server. Check EXPO_PUBLIC_API_URL (or default production API) and your internet connection.'
          );
        }
        const message = parseErrorMessage(error.response?.data, error.message || 'Login failed');
        return rejectWithValue(message);
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const registerDriver = createAsyncThunk(
  'auth/registerDriver',
  async (payload: RegisterDriverDto, { rejectWithValue }) => {
    try {
      return await authService.registerDriver(payload);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          return rejectWithValue(
            'Cannot reach API server. Check EXPO_PUBLIC_API_URL (or default production API) and your internet connection.'
          );
        }
        const message = parseErrorMessage(
          error.response?.data,
          error.message || 'Registration failed'
        );
        return rejectWithValue(message);
      }
      return rejectWithValue('Registration failed');
    }
  }
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
      .addCase(hydrateAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.status =
          action.payload.accessToken && action.payload.user
            ? 'authenticated'
            : 'unauthenticated';
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.status = 'unauthenticated';
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
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
        state.error = (action.payload as string) || action.error.message || 'Login failed';
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