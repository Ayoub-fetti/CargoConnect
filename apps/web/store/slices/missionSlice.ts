import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mission } from "../../../packages/types/mission";

interface MissionState {
  missions: Mission[];
  loading: boolean;
  error: string | null;
}

const initialState: MissionState = {
  missions: [],
  loading: false,
  error: null,
};

const missionSlice = createSlice({
  name: "missions",
  initialState,
  reducers: {
    setMissions(state, action: PayloadAction<Mission[]>) {
      state.missions = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setMissions, setLoading, setError } = missionSlice.actions;
export default missionSlice.reducer;
