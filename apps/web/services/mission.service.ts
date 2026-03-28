import api from "../lib/axios";

export const missionService = {
  // Missions (Company)
  create: (data: object) => api.post("/missions", data),
  getAll: (status?: string) =>
    api.get("/missions", { params: status ? { status } : {} }),
  getMyMissions: () => api.get("/missions/my-missions"),
  getOne: (id: string) => api.get(`/missions/${id}`),
  update: (id: string, data: object) => api.patch(`/missions/${id}`, data),
  delete: (id: string) => api.delete(`/missions/${id}`),

  // Applications (Company side)
  getMissionApplications: (missionId: string) =>
    api.get(`/applications/mission/${missionId}`),
  approveApplication: (id: string) => api.patch(`/applications/${id}/approve`),
  rejectApplication: (id: string) => api.patch(`/applications/${id}/reject`),

  getDriverProfile: (driverId: string) =>
    api.get(`/profiles/drivers/${driverId}`),
  getDriverDocuments: (driverId: string) =>
    api.get(`/profiles/drivers/${driverId}/documents`),
};
