import { TruckType } from "./enums";

export interface Truck {
  id: string;
  make: string;         // e.g., "Volvo", "Mercedes"
  model: string;        // e.g., "Actros"
  year: number;
  registrationNumber: string; // License plate
  type: TruckType;
  maxPayload: number;   // Weight limit in kg
  driverId: string;     // Relationship to the Driver
  isOperational: boolean;
  createdAt: Date;
  updatedAt: Date;
}