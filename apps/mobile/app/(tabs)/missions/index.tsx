import { Link } from 'expo-router';
import { useState } from 'react';
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
import { useMissions } from '@/hooks/useMissions';
import type { MissionStatus } from '@/types/driver';
import { formatMissionDate } from '@/utils/formatDate';
import { getCompanyName, statusLabel } from '@/utils/mission';

const FILTERS: { label: string; value?: MissionStatus }[] = [
  { label: 'All', value: undefined },
  { label: 'Open', value: 'OPEN' },
  { label: 'In progress', value: 'IN_PROGRESS' },
];

export default function MissionsScreen() {
  const [filter, setFilter] = useState<MissionStatus | undefined>(undefined);
  const { missions, loading, refreshing, error, refresh } = useMissions(filter);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="border-b border-slate-200 bg-slate-50 px-4 pb-3 pt-2 dark:border-slate-800 dark:bg-slate-950">
        <Text className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Filter by status
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isAll = f.label === 'All';
            const selected = isAll ? filter === undefined : filter === f.value;
            return (
              <Pressable
                key={f.label}
                onPress={() => setFilter(f.value)}
                className={`rounded-full px-4 py-2 ${
                  selected ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selected ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#0d9488" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-600">{error}</Text>
          <Pressable onPress={refresh} className="mt-4 rounded-full bg-brand-600 px-6 py-3">
            <Text className="font-semibold text-white">Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#0d9488" />
          }
          ListEmptyComponent={
            <EmptyState
              title="No missions yet"
              description="Check back later for new cargo runs in your area."
              icon="inventory"
            />
          }
          renderItem={({ item }) => (
            <Link href={`/(tabs)/missions/${item._id}`} asChild>
              <Pressable className="mb-3 active:opacity-90">
                <Card>
                <View className="flex-row items-start justify-between gap-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white" numberOfLines={2}>
                      {item.title}
                    </Text>
                    {getCompanyName(item) ? (
                      <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {getCompanyName(item)}
                      </Text>
                    ) : null}
                  </View>
                  <View className="rounded-full bg-brand-100 px-2 py-1 dark:bg-brand-900">
                    <Text className="text-xs font-semibold uppercase text-brand-800 dark:text-brand-200">
                      {statusLabel(item.status)}
                    </Text>
                  </View>
                </View>
                <Text className="mt-2 text-sm text-slate-600 dark:text-slate-300" numberOfLines={2}>
                  {item.origin} → {item.destination}
                </Text>
                <View className="mt-3 flex-row items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Text className="text-sm text-slate-500">
                    {formatMissionDate(item.departureDate)}
                  </Text>
                  <Text className="text-base font-bold text-brand-700 dark:text-brand-400">
                    {item.price} €
                  </Text>
                </View>
                </Card>
              </Pressable>
            </Link>
          )}
        />
      )}
    </View>
  );
}
