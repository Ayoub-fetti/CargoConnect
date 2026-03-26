import { api } from '@/services/api';

export type MissionStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface Mission {
  _id: string;
  title: string;
  description: string;
  departureLocation: string;
  arrivalLocation: string;
  salary: string;
  status: MissionStatus;
  createdAt: string;
}

export const missionService = {
  async getMissions(status?: MissionStatus) {
    const { data } = await api.get<Mission[]>('/missions', {
      params: status ? { status } : undefined,
    });
    return data;
  },

  async getMissionById(id: string) {
    const { data } = await api.get<Mission>(`/missions/${id}`);
    return data;
  },
};