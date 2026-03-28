import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
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
  async (
    payload: { missionId: string; message?: string },
    { rejectWithValue },
  ) => {
    try {
      return await driverService.applyForMission(payload);
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string | string[] | { message?: string | string[] };
      }>;

      const rawMessage = axiosError.response?.data?.message;
      const message =
        typeof rawMessage === 'string'
          ? rawMessage
          : Array.isArray(rawMessage)
            ? rawMessage.join(', ')
            : typeof rawMessage?.message === 'string'
              ? rawMessage.message
              : Array.isArray(rawMessage?.message)
                ? rawMessage.message.join(', ')
                : axiosError.message;

      return rejectWithValue(message || 'Failed to apply for mission');
    }
  },
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