import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { fetchMissions } from '@/store/missionStore';

export default function MissionsScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, loading } = useAppSelector((state) => state.missions);

  useEffect(() => {
    dispatch(fetchMissions());
  }, [dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator color="#FFFFFF" size="large" />
        <Text style={styles.loadingText}>Chargement des missions…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>DISPONIBLES</Text>
        <Text style={styles.headerTitle}>Missions</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/(tabs)/missions/${item._id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            {/* Top row: title + arrow */}
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardArrow}>→</Text>
            </View>

            {/* Route */}
            <View style={styles.routeRow}>
              <View style={styles.routeDot} />
              <Text style={styles.routeText} numberOfLines={1}>{item.departureLocation}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <View style={[styles.routeDot, styles.routeDotArrival]} />
              <Text style={styles.routeText} numberOfLines={1}>{item.arrivalLocation}</Text>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.salaryBadge}>
                <Text style={styles.salaryText}>{item.salary} €</Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune mission</Text>
            <Text style={styles.emptySubtitle}>Revenez plus tard pour découvrir de nouvelles opportunités.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    letterSpacing: 1,
  },

  // ── Header ────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },

  // ── List ──────────────────────────────────────────────────────────
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  separator: {
    height: 10,
  },

  // ── Card ──────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: 8,
  },
  cardPressed: {
    backgroundColor: '#1C1C1C',
    borderColor: 'rgba(255,255,255,0.15)',
    transform: [{ scale: 0.98 }],
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    flex: 1,
  },
  cardArrow: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.25)',
    marginLeft: 8,
  },

  // ── Route ─────────────────────────────────────────────────────────
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  routeDotArrival: {
    backgroundColor: '#FFFFFF',
  },
  routeLine: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginLeft: 3,
  },
  routeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    flex: 1,
  },

  // ── Footer ────────────────────────────────────────────────────────
  cardFooter: {
    flexDirection: 'row',
    marginTop: 6,
  },
  salaryBadge: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  salaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  // ── Empty ─────────────────────────────────────────────────────────
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    lineHeight: 20,
  },
});