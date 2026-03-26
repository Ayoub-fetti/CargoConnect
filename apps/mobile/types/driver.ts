/** Aligns with API login user payload and driver profile fields. */

export type UserRole = 'DRIVER' | 'COMPANY' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export type MissionStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Mission {
  _id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight: number;
  price: number;
  departureDate: string;
  estimatedDuration?: string;
  status: MissionStatus;
  requiredLicenses: string[];
  companyId?: unknown;
  assignedDriverId?: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  _id: string;
  missionId: Mission | string;
  driverId: string;
  status: ApplicationStatus;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverProfile {
  _id: string;
  email: string;
  role: 'DRIVER';
  fullName?: string;
  phone?: string;
  licenseTypes?: string[];
  zone?: string[];
  isAvailable?: boolean;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
