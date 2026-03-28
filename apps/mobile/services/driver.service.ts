import { CONFIG } from '@/constants/config';
import { api, tokenStorage } from '@/services/api';

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

  const normalizedUri =
    input.fileUri.startsWith('file://') || input.fileUri.startsWith('content://')
      ? input.fileUri
      : `file://${input.fileUri}`;

  form.append('file', {
    uri: normalizedUri,
    name: input.fileName || 'upload.bin',
    type: input.mimeType || 'application/octet-stream',
  } as any);
}

async function postMultipart(path: string, form: FormData) {
  const token = await tokenStorage.getAccessToken();

  const response = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  const rawBody = await response.text();
  let parsed: any = null;
  if (rawBody) {
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      parsed = { message: rawBody };
    }
  }

  if (!response.ok) {
    const message = parsed?.message || `Upload failed (${response.status})`;
    throw new Error(Array.isArray(message) ? message.join('\n') : message);
  }

  return parsed;
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
    return postMultipart('/profiles/avatar', form);
  },

  async uploadDocument(params: UploadFileInput & { type: string }) {
    const form = new FormData();
    appendUploadFile(form, params);
    form.append('type', params.type);
    return postMultipart('/profiles/documents', form);
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