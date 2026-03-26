import { useCallback, useEffect, useState } from 'react';
import { missionsService } from '@/services/missions.service';
import { getApiErrorMessage } from '@/services/api';
import type { Mission, MissionStatus } from '@/types/driver';

export function useMissions(status?: MissionStatus) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await missionsService.list(status);
      setMissions(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  return { missions, loading, refreshing, error, refresh, reload: load };
}

export function useMission(id: string | undefined) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setMission(null);
      setError('Invalid mission');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await missionsService.getById(id);
      setMission(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setMission(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { mission, loading, error, reload: load };
}
