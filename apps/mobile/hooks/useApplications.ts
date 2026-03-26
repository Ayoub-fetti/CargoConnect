import { useCallback, useEffect, useState } from 'react';
import { applicationsService } from '@/services/applications.service';
import { getApiErrorMessage } from '@/services/api';
import type { Application } from '@/types/driver';

export function useMyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await applicationsService.myApplications();
      setApplications(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  return { applications, loading, refreshing, error, refresh, reload: load };
}
