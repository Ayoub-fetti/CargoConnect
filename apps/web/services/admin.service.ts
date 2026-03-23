import api from "../lib/axios";

export const adminService = {
  // Users
  listUsers: (params?: { role?: string; page?: number; limit?: number }) =>
    api.get("/admin/users", { params }),
  toggleUserStatus: (id: string) =>
    api.patch(`/admin/users/${id}/toggle-status`),

  // Stats
  getStats: () => api.get("/admin/stats"),

  // Subscriptions / Bills
  listSubscriptions: (params?: { page?: number; limit?: number }) =>
    api.get("/admin/subscriptions", { params }),
  listBills: (params?: { page?: number; limit?: number }) =>
    api.get("/subscriptions/admin/bills", { params }),
};
