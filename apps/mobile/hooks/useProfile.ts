import { useCallback, useEffect, useState } from 'react';
import { profileService } from '@/services/profile.service';
import { getApiErrorMessage } from '@/services/api';
import type { DriverProfile } from '@/types/driver';

export function useDriverProfile() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await profileService.getMe();
      setProfile(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(
    async (body: Parameters<typeof profileService.updateMe>[0]) => {
      setSaving(true);
      setError(null);
      try {
        const data = await profileService.updateMe(body);
        setProfile(data);
        return data;
      } catch (e) {
        const msg = getApiErrorMessage(e);
        setError(msg);
        throw new Error(msg);
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return { profile, loading, saving, error, reload: load, save };
}
