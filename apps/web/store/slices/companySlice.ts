import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Company } from "../../../../packages/types/user";

interface CompanyState {
  profile: Company | null;
  loading: boolean;
}

export enum Role {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  COMPANY = "COMPANY",
}
export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface Company extends User {
  companyName: string;
  legalInfo: string;
  description: string;
  location: string;
  logo: string;
}

const initialState: CompanyState = { profile: null, loading: false };

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Company>) {
      state.profile = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setProfile, setLoading } = companySlice.actions;
export default companySlice.reducer;
