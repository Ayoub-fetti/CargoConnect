import { api } from '@/services/api';
import type { Mission, MissionStatus } from '@/types/driver';

export const missionsService = {
  async list(status?: MissionStatus): Promise<Mission[]> {
    const { data } = await api.get<Mission[]>('/missions', {
      params: status ? { status } : undefined,
    });
    return data;
  },

  async getById(id: string): Promise<Mission> {
    const { data } = await api.get<Mission>(`/missions/${id}`);
    return data;
  },
};
