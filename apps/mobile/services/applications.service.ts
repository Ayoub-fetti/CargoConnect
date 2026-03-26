import { api } from '@/services/api';
import type { Application } from '@/types/driver';

export interface CreateApplicationBody {
  missionId: string;
  message?: string;
}

export const applicationsService = {
  async apply(body: CreateApplicationBody): Promise<Application> {
    const { data } = await api.post<Application>('/applications', body);
    return data;
  },

  async myApplications(): Promise<Application[]> {
    const { data } = await api.get<Application[]>('/applications/my-applications');
    return data;
  },
};
