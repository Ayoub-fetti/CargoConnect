import { Link } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { useMyApplications } from '@/hooks/useApplications';
import type { Application, Mission } from '@/types/driver';
import { formatDateTime } from '@/utils/formatDate';
import { statusLabel } from '@/utils/mission';

function missionTitle(app: Application): string {
  const m = app.missionId;
  if (m && typeof m === 'object' && m !== null && 'title' in m) {
    return String((m as Mission).title);
  }
  return 'Mission';
}

function missionRoute(app: Application): string | null {
  const m = app.missionId;
  if (m && typeof m === 'object' && m !== null && 'origin' in m && 'destination' in m) {
    const miss = m as Mission;
    return `${miss.origin} → ${miss.destination}`;
  }
  return null;
}

function missionIdForLink(app: Application): string | null {
  const m = app.missionId;
  if (typeof m === 'string') return m;
  if (m && typeof m === 'object' && '_id' in m) {
    return String((m as { _id: string })._id);
  }
  return null;
}

export default function ApplicationsScreen() {
  const { applications, loading, refreshing, error, refresh } = useMyApplications();

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <Text className="text-center text-red-600">{error}</Text>
        <Pressable onPress={refresh} className="mt-4 rounded-full bg-brand-600 px-6 py-3">
          <Text className="font-semibold text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">My applications</Text>
        <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track status for missions you applied to
        </Text>
      </View>
      <FlatList
        data={applications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#0d9488" />
        }
        ListEmptyComponent={
          <EmptyState
            title="No applications yet"
            description="Browse missions and send your first application."
            icon="assignment"
          />
        }
        renderItem={({ item }) => {
          const mid = missionIdForLink(item);
          const card = (
            <Card>
              <View className="flex-row items-start justify-between gap-2">
                <Text className="flex-1 text-lg font-bold text-slate-900 dark:text-white" numberOfLines={2}>
                  {missionTitle(item)}
                </Text>
                <View
                  className={`rounded-full px-2 py-1 ${
                    item.status === 'ACCEPTED'
                      ? 'bg-emerald-100 dark:bg-emerald-900'
                      : item.status === 'REJECTED'
                        ? 'bg-red-100 dark:bg-red-900'
                        : 'bg-amber-100 dark:bg-amber-900'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold uppercase ${
                      item.status === 'ACCEPTED'
                        ? 'text-emerald-800 dark:text-emerald-200'
                        : item.status === 'REJECTED'
                          ? 'text-red-800 dark:text-red-200'
                          : 'text-amber-800 dark:text-amber-200'
                    }`}
                  >
                    {statusLabel(item.status)}
                  </Text>
                </View>
              </View>
              {missionRoute(item) ? (
                <Text className="mt-2 text-sm text-slate-600 dark:text-slate-400">{missionRoute(item)}</Text>
              ) : null}
              {item.message ? (
                <Text className="mt-2 text-sm italic text-slate-500" numberOfLines={3}>
                  “{item.message}”
                </Text>
              ) : null}
              <Text className="mt-3 text-xs text-slate-400">
                {item.createdAt ? formatDateTime(item.createdAt) : ''}
              </Text>
            </Card>
          );

          if (mid) {
            return (
              <Link href={`/(tabs)/missions/${mid}`} asChild>
                <Pressable className="mb-3 active:opacity-90">{card}</Pressable>
              </Link>
            );
          }
          return <View className="mb-3">{card}</View>;
        }}
      />
    </View>
  );
}
