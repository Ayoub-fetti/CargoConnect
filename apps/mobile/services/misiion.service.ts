import { api } from '@/services/api';

export type MissionStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'CLOSED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface MissionCompany {
  _id?: string;
  companyName?: string;
  email?: string;
  location?: string;
  description?: string;
  legalInfo?: string;
  logo?: string;
}

export interface Mission {
  _id: string;
  title: string;
  description: string;
  departureLocation: string;
  arrivalLocation: string;
  salary: number;
  status: MissionStatus;
  createdAt: string;
  cargoType?: string;
  weight?: number;
  departureDate?: string;
  estimatedDuration?: string;
  requiredLicenses?: string[];
  company?: MissionCompany;
}

type RawMission = Partial<Mission> & {
  _id: string;
  origin?: string;
  destination?: string;
  price?: number;
  companyId?: string | MissionCompany;
};

function normalizeMission(raw: RawMission): Mission {
  const company =
    raw.companyId && typeof raw.companyId === 'object' ? raw.companyId : undefined;

  return {
    _id: raw._id,
    title: raw.title || '',
    description: raw.description || '',
    departureLocation: raw.departureLocation || raw.origin || '',
    arrivalLocation: raw.arrivalLocation || raw.destination || '',
    salary:
      typeof raw.salary === 'number'
        ? raw.salary
        : typeof raw.price === 'number'
          ? raw.price
          : 0,
    status: (raw.status || 'OPEN') as MissionStatus,
    createdAt: raw.createdAt || '',
    cargoType: raw.cargoType,
    weight: raw.weight,
    departureDate: raw.departureDate,
    estimatedDuration: raw.estimatedDuration,
    requiredLicenses: raw.requiredLicenses,
    company,
  };
}

export const missionService = {
  async getMissions(status?: MissionStatus) {
    const { data } = await api.get<RawMission[]>('/missions', {
      params: status ? { status } : undefined,
    });
    return data.map(normalizeMission);
  },

  async getMissionById(id: string) {
    const { data } = await api.get<RawMission>(`/missions/${id}`);
    return normalizeMission(data);
  },
};