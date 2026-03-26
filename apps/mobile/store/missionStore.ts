import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { driverService } from '@/services/driver.service';
import { missionService, Mission, MissionStatus } from '@/services/misiion.service';

interface MissionsState {
  items: Mission[];
  selected: Mission | null;
  applications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MissionsState = {
  items: [],
  selected: null,
  applications: [],
  loading: false,
  error: null,
};

export const fetchMissions = createAsyncThunk(
  'missions/fetchAll',
  async (status?: MissionStatus) => missionService.getMissions(status)
);

export const fetchMissionById = createAsyncThunk(
  'missions/fetchById',
  async (id: string) => missionService.getMissionById(id)
);

export const applyForMission = createAsyncThunk(
  'missions/apply',
  async (payload: { missionId: string; message?: string }) =>
    driverService.applyForMission(payload)
);

export const fetchMyApplications = createAsyncThunk(
  'missions/myApplications',
  async () => driverService.getMyApplications()
);

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    clearMissionError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch missions';
      })
      .addCase(fetchMissionById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
      });
  },
});

export const { clearMissionError } = missionsSlice.actions;
export const missionsReducer = missionsSlice.reducer;