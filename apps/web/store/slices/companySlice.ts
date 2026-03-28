import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company } from "../../../packages/types/user";

interface CompanyState {
  profile: Company | null;
  loading: boolean;
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
