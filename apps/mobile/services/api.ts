import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from '@/constants/config';

const ACCESS_TOKEN_KEY = 'cc_access_token';
const REFRESH_TOKEN_KEY = 'cc_refresh_token';
const USER_KEY = 'cc_user';

let inMemoryAccessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const tokenStorage = {
  keys: {
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
  },
  async setAccessToken(token: string) {
    inMemoryAccessToken = token;
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  async setRefreshToken(token: string) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  async setUser(user: unknown) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  async getAccessToken() {
    if (inMemoryAccessToken) return inMemoryAccessToken;
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    inMemoryAccessToken = token;
    return token;
  },
  async getRefreshToken() {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },
  async clearAll() {
    inMemoryAccessToken = null;
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
  },
};

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api: AxiosInstance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  const res = await axios.post<{ access_token: string }>(
    `${CONFIG.API_BASE_URL}/auth/refresh`,
    { refreshToken }
  );

  const newToken = res.data.access_token;
  await tokenStorage.setAccessToken(newToken);
  return newToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    if (!original || status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;
    if (!newToken) {
      await tokenStorage.clearAll();
      return Promise.reject(error);
    }

    original.headers = original.headers || {};
    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
  }
);