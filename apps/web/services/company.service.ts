import api from '../lib/axios';

export const companyService = {
  // Profile
  getProfile: () => api.get('/profiles/me'),
  updateProfile: (data: object) => api.patch('/profiles/me', data),
  uploadLogo: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/profiles/logo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  // Documents
  getDocuments: () => api.get('/profiles/documents'),
  uploadDocument: (file: File, type: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    return api.post('/profiles/documents', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteDocument: (id: string) => api.delete(`/profiles/documents/${id}`),

  // Subscriptions
  getSubscriptionStatus: () => api.get('/subscriptions/status'),
  createCheckout: (data: { plan: string }) => api.post('/subscriptions/checkout', data),
  cancelSubscription: () => api.post('/subscriptions/cancel'),

};
