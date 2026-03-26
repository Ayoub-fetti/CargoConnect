import { api } from '@/services/api';
import type { DriverProfile } from '@/types/driver';

export interface UpdateDriverProfileBody {
  fullName?: string;
  phone?: string;
  licenseTypes?: string[];
  isAvailable?: boolean;
  zone?: string[];
}

export const profileService = {
  async getMe(): Promise<DriverProfile> {
    const { data } = await api.get<DriverProfile>('/profiles/me');
    return data;
  },

  async updateMe(body: UpdateDriverProfileBody): Promise<DriverProfile> {
    const { data } = await api.patch<DriverProfile>('/profiles/me', body);
    return data;
  },

  /**
   * @param file — `{ uri, name, type }` from image picker (React Native FormData).
   */
  async uploadAvatar(file: { uri: string; name: string; type: string }): Promise<{ avatar: string }> {
    const form = new FormData();
    form.append('file', file as unknown as Blob);
    const { data } = await api.post<{ avatar: string }>('/profiles/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async uploadDocument(
    file: { uri: string; name: string; type: string },
    type: string,
  ): Promise<unknown> {
    const form = new FormData();
    form.append('file', file as unknown as Blob);
    form.append('type', type);
    return api.post('/profiles/documents', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },

  async getDocuments(): Promise<unknown[]> {
    const { data } = await api.get<unknown[]>('/profiles/documents');
    return data;
  },

  async deleteDocument(id: string): Promise<void> {
    await api.delete(`/profiles/documents/${id}`);
  },
};
