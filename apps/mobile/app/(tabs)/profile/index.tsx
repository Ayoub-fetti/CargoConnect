import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useDriverProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/services/api';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading, saving, error, save, reload } = useDriverProfile();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [available, setAvailable] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [listRefreshing, setListRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setListRefreshing(true);
    await reload();
    setListRefreshing(false);
  }, [reload]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName ?? '');
      setPhone(profile.phone ?? '');
      setAvailable(profile.isAvailable ?? true);
    }
  }, [profile]);

  async function onSave() {
    setLocalError(null);
    setSaved(false);
    try {
      await save({
        fullName: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        isAvailable: available,
      });
      setSaved(true);
    } catch (e) {
      setLocalError(getApiErrorMessage(e, 'Could not save profile.'));
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <Screen
      scroll
      refreshing={listRefreshing}
      onRefresh={onRefresh}
      className="bg-slate-50 dark:bg-slate-950"
    >
      <View className="px-4 pb-8 pt-2">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">Your profile</Text>
        <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</Text>

        <View className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</Text>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="flex-1 text-slate-800 dark:text-slate-200">Open to new missions</Text>
            <Switch
              value={available}
              onValueChange={setAvailable}
              trackColor={{ false: '#cbd5e1', true: '#99f6e4' }}
              thumbColor={available ? '#0d9488' : '#f4f4f5'}
            />
          </View>
        </View>

        <View className="mt-6">
          <TextField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
          <TextField
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="+212 …"
            keyboardType="phone-pad"
          />
        </View>

        {(localError || error) ? (
          <Text className="mb-3 text-sm text-red-600">{localError ?? error}</Text>
        ) : null}
        {saved ? (
          <Text className="mb-3 text-sm text-emerald-600">Profile saved.</Text>
        ) : null}

        <Button title="Save changes" onPress={onSave} loading={saving} />
      </View>
    </Screen>
  );
}
