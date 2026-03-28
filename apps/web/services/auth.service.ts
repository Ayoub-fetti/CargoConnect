import api from '../lib/axios';

export const authService = {
  registerCompany: (data: FormData | object) => api.post('/auth/register/company', data),
  registerDriver: (data: object) => api.post('/auth/register/driver', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (data: { token: string }) => api.post('/auth/verify-email', data),
  forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
  resetPassword: (data: { token: string; password: string }) => api.post('/auth/reset-password', data),
};
