import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '@/services/auth.service';
import * as tokenStorage from '@/services/token-storage';
import { getApiErrorMessage } from '@/services/api';
import type { AuthUser } from '@/types/driver';
import type { RegisterDriverBody } from '@/services/auth.service';

export interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  bootstrapDone: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  bootstrapDone: false,
  error: null,
};

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const access = await tokenStorage.getAccessToken();
      const refresh = await tokenStorage.getRefreshToken();
      const userJson = await tokenStorage.getUserJson();
      if (!access || !refresh || !userJson) return null;
      return JSON.parse(userJson) as AuthUser;
    } catch (e) {
      await tokenStorage.clearAll();
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    body: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { tokens, user } = await authService.login(body);
      await tokenStorage.saveSession(
        tokens.access,
        tokens.refresh,
        JSON.stringify(user),
      );
      return user;
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'Login failed'));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    try {
      await authService.logout();
    } catch {
      /* still clear local session */
    }
    await tokenStorage.clearAll();
  } catch (e) {
    return rejectWithValue(getApiErrorMessage(e));
  }
});

export const registerDriver = createAsyncThunk(
  'auth/registerDriver',
  async (body: RegisterDriverBody, { rejectWithValue }) => {
    try {
      return await authService.registerDriver(body);
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'Registration failed'));
    }
  },
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      return await authService.verifyEmail(token);
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e, 'Verification failed'));
    }
  },
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.forgotPassword(email);
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      return await authService.resetPassword(token, newPassword);
    } catch (e) {
      return rejectWithValue(getApiErrorMessage(e));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.status = 'unauthenticated';
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.bootstrapDone = true;
        if (action.payload) {
          state.user = action.payload;
          state.status = 'authenticated';
        } else {
          state.user = null;
          state.status = 'unauthenticated';
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.bootstrapDone = true;
        state.user = null;
        state.status = 'unauthenticated';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = (action.payload as string) ?? 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
      })
      .addCase(registerDriver.pending, (state) => {
        state.error = null;
      })
      .addCase(registerDriver.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Registration failed';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Verification failed';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = (action.payload as string) ?? null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = (action.payload as string) ?? null;
      });
  },
});

export const { clearAuth, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
