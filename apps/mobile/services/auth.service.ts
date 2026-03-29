import { api } from '@/services/api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDriverDto {
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
    id: string;
    email: string;
    role: 'DRIVER' | 'COMPANY' | 'ADMIN';
    isVerified: boolean;
  };
}

export const authService = {
  async registerDriver(payload: RegisterDriverDto) {
    const { data } = await api.post<{ message: string }>('/auth/register/driver', payload);
    return data;
  },

  async login(payload: LoginDto) {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  async logout() {
    const { data } = await api.post<{ message: string }>('/auth/logout');
    return data;
  },

  async verifyEmail(token: string) {
    const { data } = await api.post<{ message: string }>('/auth/verify-email', { token });
    return data;
  },

  async forgotPassword(email: string) {
    const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, newPassword: string) {
    const { data } = await api.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    });
    return data;
  },
};