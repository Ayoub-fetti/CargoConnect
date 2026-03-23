import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setMissions, setLoading, setError } from '../store/slices/missionSlice';
import { missionService } from '../services/mission.service';

export function useMissions() {
  const dispatch = useAppDispatch();
  const { missions, loading, error } = useAppSelector((s) => s.missions);

  const fetchMissions = useCallback(async (status?: string) => {
    dispatch(setLoading(true));
    try {
      const { data } = await missionService.getAll(status);
      dispatch(setMissions(data));
    } catch (e: any) {
      dispatch(setError(e.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { missions, loading, error, fetchMissions };
}
