import { MissionStatus, ApplicationStatus } from './enums';

export interface Mission {
  id: string;
  title: string;
  description: string;
  departureLocation: string;
  arrivalLocation: string;
  salary: string;
  status: MissionStatus;
  createdAt: Date;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  appliedAt: Date;
  missionId: string;
  driverId: string;
}