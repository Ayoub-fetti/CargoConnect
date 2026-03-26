import { api } from '@/services/api';
import type { AuthUser } from '@/types/driver';

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterDriverBody {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  licenseTypes?: string[];
  zone?: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: unknown;
    email: string;
    role: AuthUser['role'];
    isVerified: boolean;
  };
}

export interface RefreshResponse {
  access_token: string;
}

export interface MessageResponse {
  message: string;
}

function normalizeUser(raw: LoginResponse['user']): AuthUser {
  return {
    id: String(raw.id),
    email: raw.email,
    role: raw.role,
    isVerified: raw.isVerified,
  };
}

export const authService = {
  async login(body: LoginBody): Promise<{ tokens: { access: string; refresh: string }; user: AuthUser }> {
    const { data } = await api.post<LoginResponse>('/auth/login', body);
    return {
      tokens: { access: data.access_token, refresh: data.refresh_token },
      user: normalizeUser(data.user),
    };
  },

  async registerDriver(body: RegisterDriverBody): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/register/driver', body);
    return data;
  },

  async verifyEmail(token: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/verify-email', { token });
    return data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse>('/auth/refresh', {
      refreshToken,
    });
    return data;
  },

  async logout(): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/logout');
    return data;
  },

  async forgotPassword(email: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>('/auth/reset-password', {
      token,
      newPassword,
    });
    return data;
  },
};
