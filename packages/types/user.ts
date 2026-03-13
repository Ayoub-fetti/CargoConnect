import { Role } from './enums';

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver extends User {
  fullName: string;
  phone: string;
  avatar: string;
  licenseTypes: string[]; // e.g., ['B', 'C1']
  isAvailable: boolean;
  zone: string[];
}

export interface Company extends User {
  companyName: string;
  legalInfo: string;
  description: string;
  location: string;
  logo: string;
}