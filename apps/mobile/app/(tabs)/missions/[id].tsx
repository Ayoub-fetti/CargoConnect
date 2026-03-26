import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { applicationsService } from '@/services/applications.service';
import { getApiErrorMessage } from '@/services/api';
import { useMission } from '@/hooks/useMissions';
import { formatMissionDate } from '@/utils/formatDate';
import { getCompanyName, statusLabel } from '@/utils/mission';

export default function MissionDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { mission, loading, error } = useMission(id);
  const [message, setMessage] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  async function onApply() {
    if (!id) return;
    setApplyError(null);
    setApplyLoading(true);
    try {
      await applicationsService.apply({
        missionId: id,
        message: message.trim() || undefined,
      });
      setApplySuccess(true);
    } catch (e) {
      setApplyError(getApiErrorMessage(e));
    } finally {
      setApplyLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  if (error || !mission) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <Text className="text-center text-red-600">{error ?? 'Mission not found.'}</Text>
        <Button title="Go back" variant="secondary" onPress={() => router.back()} className="mt-6" />
      </View>
    );
  }

  const canApply = mission.status === 'OPEN' && !applySuccess;

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Card className="mb-4">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-xl font-bold text-slate-900 dark:text-white">{mission.title}</Text>
          <View className="rounded-full bg-brand-100 px-2 py-1 dark:bg-brand-900">
            <Text className="text-xs font-semibold uppercase text-brand-800 dark:text-brand-200">
              {statusLabel(mission.status)}
            </Text>
          </View>
        </View>
        {getCompanyName(mission) ? (
          <Text className="mt-2 text-slate-600 dark:text-slate-400">{getCompanyName(mission)}</Text>
        ) : null}
      </Card>

      <Card className="mb-4">
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Route</Text>
        <Text className="text-base text-slate-900 dark:text-white">
          {mission.origin} → {mission.destination}
        </Text>
        <View className="my-4 h-px bg-slate-100 dark:bg-slate-800" />
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Schedule</Text>
        <Text className="text-slate-800 dark:text-slate-200">
          Departure: {formatMissionDate(mission.departureDate)}
        </Text>
        {mission.estimatedDuration ? (
          <Text className="mt-1 text-slate-600 dark:text-slate-400">
            Est. duration: {mission.estimatedDuration}
          </Text>
        ) : null}
      </Card>

      <Card className="mb-4">
        <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Cargo</Text>
        <Text className="text-slate-900 dark:text-white">{mission.cargoType}</Text>
        <Text className="mt-2 text-slate-600 dark:text-slate-400">Weight: {mission.weight} kg</Text>
        {mission.requiredLicenses?.length ? (
          <Text className="mt-2 text-slate-600 dark:text-slate-400">
            Licenses: {mission.requiredLicenses.join(', ')}
          </Text>
        ) : null}
      </Card>

      <Card className="mb-6">
        <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Description</Text>
        <Text className="leading-6 text-slate-800 dark:text-slate-200">{mission.description}</Text>
        <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <Text className="text-slate-500">Offer</Text>
          <Text className="text-2xl font-bold text-brand-700 dark:text-brand-400">{mission.price} €</Text>
        </View>
      </Card>

      {applySuccess ? (
        <View className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950">
          <Text className="text-center font-semibold text-emerald-800 dark:text-emerald-200">
            Application sent. The company will review your profile.
          </Text>
        </View>
      ) : canApply ? (
        <>
          <TextField
            label="Message (optional)"
            value={message}
            onChangeText={setMessage}
            placeholder="Introduce yourself or your vehicle..."
            multiline
          />
          {applyError ? <Text className="mb-3 text-sm text-red-600">{applyError}</Text> : null}
          <Button title="Apply for this mission" onPress={onApply} loading={applyLoading} />
        </>
      ) : (
        <Text className="text-center text-slate-500">
          {mission.status !== 'OPEN'
            ? 'This mission is no longer accepting applications.'
            : null}
        </Text>
      )}
    </ScrollView>
  );
}
