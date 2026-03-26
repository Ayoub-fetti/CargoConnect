import { api } from '@/services/api';

export interface CreateApplicationDto {
  missionId: string;
  message?: string;
}

export interface UpdateDriverProfileDto {
  fullName?: string;
  phone?: string;
  licenseTypes?: string[];
  isAvailable?: boolean;
  zone?: string[];
}

export const driverService = {
  async applyForMission(payload: CreateApplicationDto) {
    const { data } = await api.post('/applications', payload);
    return data;
  },

  async getMyApplications() {
    const { data } = await api.get('/applications/my-applications');
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/profiles/me');
    return data;
  },

  async updateProfile(payload: UpdateDriverProfileDto) {
    const { data } = await api.patch('/profiles/me', payload);
    return data;
  },

  async uploadAvatar(fileUri: string, fileName = 'avatar.jpg', mimeType = 'image/jpeg') {
    const form = new FormData();
    form.append('file', {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    } as any);

    const { data } = await api.post('/profiles/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async uploadDocument(params: {
    fileUri: string;
    type: string;
    fileName?: string;
    mimeType?: string;
  }) {
    const form = new FormData();
    form.append('file', {
      uri: params.fileUri,
      name: params.fileName || 'document.pdf',
      type: params.mimeType || 'application/pdf',
    } as any);
    form.append('type', params.type);

    const { data } = await api.post('/profiles/documents', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getDocuments() {
    const { data } = await api.get('/profiles/documents');
    return data;
  },

  async deleteDocument(id: string) {
    const { data } = await api.delete(`/profiles/documents/${id}`);
    return data;
  },
};