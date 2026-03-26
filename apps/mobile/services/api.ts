import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/config';
import * as tokenStorage from '@/services/token-storage';
import { emitSessionExpired } from '@/services/auth-events';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const baseURL = `${API_BASE_URL.replace(/\/$/, '')}/api`;

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config;
    if (!original || original._retry) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = original.url ?? '';
    if (
      status !== 401 ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    const refresh = await tokenStorage.getRefreshToken();
    if (!refresh) {
      emitSessionExpired();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<{ access_token: string }>(
        `${baseURL}/auth/refresh`,
        { refreshToken: refresh },
      );
      await tokenStorage.setAccessToken(data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return api(original);
    } catch {
      emitSessionExpired();
      return Promise.reject(error);
    }
  },
);

export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    const msg = data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
