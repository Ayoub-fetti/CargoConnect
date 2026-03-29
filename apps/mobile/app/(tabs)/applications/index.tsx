import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { fetchMyApplications } from '@/store/missionStore';

function toPublicAssetUrl(path?: string) {
  if (!path) return null;
  return path;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:  { bg: 'rgba(234,179,8,0.12)',  color: '#EAB308', label: 'En attente' },
  ACCEPTED: { bg: 'rgba(34,197,94,0.12)',  color: '#22C55E', label: 'Acceptée'  },
  REJECTED: { bg: 'rgba(239,68,68,0.12)',  color: '#EF4444', label: 'Refusée'   },
};

function StatusBadge({ status }: { status?: string }) {
  const key = (status || 'PENDING').toUpperCase();
  const s = STATUS_STYLES[key] ?? STATUS_STYLES.PENDING;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

export default function ApplicationsScreen() {
  const dispatch = useAppDispatch();
  const { applications, loading } = useAppSelector((state) => state.missions);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator color="#FFFFFF" size="large" />
        <Text style={styles.loadingText}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>SUIVI</Text>
        <Text style={styles.headerTitle}>Candidatures</Text>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item, index) => item._id || `${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const mission = item.missionId || {};
          const from = mission.origin || mission.departureLocation || 'N/A';
          const to = mission.destination || mission.arrivalLocation || 'N/A';
          const salary = mission.price ?? mission.salary;
          const company =
            mission.companyId && typeof mission.companyId === 'object'
              ? mission.companyId
              : null;
          const logoUrl = toPublicAssetUrl(company?.logo);

          return (
            <View style={styles.card}>
              {/* Top: title + status */}
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {mission.title || 'Candidature'}
                </Text>
                <StatusBadge status={item.status} />
              </View>

              {/* Route */}
              <View style={styles.routeRow}>
                <View style={styles.routeDot} />
                <Text style={styles.routeText} numberOfLines={1}>{from}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, styles.routeDotArrival]} />
                <Text style={styles.routeText} numberOfLines={1}>{to}</Text>
              </View>

              {/* Meta row */}
              <View style={styles.metaRow}>
                {salary != null && (
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>{salary} MAD</Text>
                  </View>
                )}
                {item.createdAt && (
                  <Text style={styles.metaDate}>
                    {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </Text>
                )}
              </View>

              {/* Message */}
              {item.message ? (
                <View style={styles.messageBlock}>
                  <Text style={styles.messageLabel}>MON MESSAGE</Text>
                  <Text style={styles.messageText}>{item.message}</Text>
                </View>
              ) : null}

              {/* Company */}
              {company ? (
                <View style={styles.companyBlock}>
                  <View style={styles.companyHeader}>
                    {logoUrl ? (
                      <Image source={{ uri: logoUrl }} style={styles.companyLogo} />
                    ) : (
                      <View style={styles.companyLogoFallback}>
                        <Text style={styles.companyLogoFallbackText}>
                          {(company.companyName || '?')[0].toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.companyName}>
                        {company.companyName || 'N/A'}
                      </Text>
                      {company.description ? (
                        <Text style={styles.companyDesc} numberOfLines={2}>
                          {company.description}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune candidature</Text>
            <Text style={styles.emptySubtitle}>
              Postulez à des missions pour les retrouver ici.
            </Text>
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

  // ── Card ──────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    flex: 1,
  },

  // ── Status badge ──────────────────────────────────────────────────
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
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
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  routeDotArrival: {
    backgroundColor: '#FFFFFF',
  },
  routeLine: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 3,
  },
  routeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    flex: 1,
  },

  // ── Meta row ──────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  metaBadge: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  metaBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  metaDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.28)',
    fontWeight: '500',
  },

  // ── Message ───────────────────────────────────────────────────────
  messageBlock: {
    backgroundColor: '#0F0F0F',
    borderRadius: 12,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  messageLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: 'rgba(255,255,255,0.25)',
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 19,
  },

  // ── Company ───────────────────────────────────────────────────────
  companyBlock: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
    marginTop: 2,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
  },
  companyLogoFallback: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogoFallbackText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '800',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  companyDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
    lineHeight: 17,
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