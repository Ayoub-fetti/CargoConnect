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

type UploadFileInput = {
  fileUri: string;
  fileName?: string;
  mimeType?: string;
  webFile?: unknown;
};

function appendUploadFile(form: FormData, input: UploadFileInput) {
  // Expo web needs a real File/Blob in FormData, while native uses { uri, name, type }.
  if (input.webFile instanceof Blob) {
    if (typeof File !== 'undefined' && input.webFile instanceof File) {
      form.append('file', input.webFile);
      return;
    }

    if (typeof File !== 'undefined') {
      const fileFromBlob = new File(
        [input.webFile],
        input.fileName || 'upload.bin',
        { type: input.mimeType || input.webFile.type || 'application/octet-stream' },
      );
      form.append('file', fileFromBlob);
      return;
    }
  }

  form.append('file', {
    uri: input.fileUri,
    name: input.fileName || 'upload.bin',
    type: input.mimeType || 'application/octet-stream',
  } as any);
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

  async uploadAvatar(params: UploadFileInput) {
    const form = new FormData();
    appendUploadFile(form, params);

    const { data } = await api.post('/profiles/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async uploadDocument(params: UploadFileInput & { type: string }) {
    const form = new FormData();
    appendUploadFile(form, params);
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