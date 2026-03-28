import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/hooks/useAuth';
import { applyForMission, fetchMissionById } from '@/store/missionStore';
import { CONFIG } from '@/constants/config';

function toPublicAssetUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${CONFIG.API_BASE_URL.replace('/api', '')}/${path.replace(/^\/+/, '')}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function MissionDetailsScreen() {
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selected, loading } = useAppSelector((state) => state.missions);
  const [motivationMessage, setMotivationMessage] = useState('');
  const [focused, setFocused] = useState(false);

  const missionId = useMemo(() => {
    if (!id) return '';
    return Array.isArray(id) ? id[0] || '' : id;
  }, [id]);

  useEffect(() => {
    if (missionId) dispatch(fetchMissionById(missionId));
  }, [dispatch, missionId]);

  const onApply = async () => {
    if (!missionId) return;
    const message = motivationMessage.trim();
    if (message.length < 10) {
      Alert.alert('Validation', 'Veuillez écrire un message de motivation (minimum 10 caractères).');
      return;
    }
    const result = await dispatch(applyForMission({ missionId, message }));
    if (result.meta.requestStatus === 'fulfilled') {
      Alert.alert('Succès', 'Candidature envoyée avec succès.');
      setMotivationMessage('');
      return;
    }
    const errorMessage =
      (result.payload as string | undefined) ||
      result.error?.message ||
      'Impossible d\'envoyer la candidature.';
    Alert.alert('Erreur', errorMessage);
  };

  if (loading || !selected) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator color="#FFFFFF" size="large" />
        <Text style={styles.loadingText}>Chargement…</Text>
      </SafeAreaView>
    );
  }

  const logoUrl = toPublicAssetUrl(selected.company?.logo);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Title block ── */}
        <View style={styles.titleBlock}>
          <Text style={styles.titleLabel}>MISSION</Text>
          <Text style={styles.title}>{selected.title}</Text>
          {selected.description ? (
            <Text style={styles.description}>{selected.description}</Text>
          ) : null}
        </View>

        {/* ── Route card ── */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Itinéraire</Text>
          <View style={styles.routeRow}>
            <View style={styles.routeDot} />
            <Text style={styles.routeText}>{selected.departureLocation}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, styles.routeDotArrival]} />
            <Text style={styles.routeText}>{selected.arrivalLocation}</Text>
          </View>
        </View>

        {/* ── Details grid ── */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Détails</Text>
          <InfoRow label="Rémunération" value={`${selected.salary} MAD`} />
          {selected.cargoType ? (
            <InfoRow label="Type de cargo" value={selected.cargoType} />
          ) : null}
          {typeof selected.weight === 'number' ? (
            <InfoRow label="Poids" value={`${selected.weight} kg`} />
          ) : null}
          {selected.departureDate ? (
            <InfoRow
              label="Départ"
              value={new Date(selected.departureDate).toLocaleString()}
            />
          ) : null}
          {selected.estimatedDuration ? (
            <InfoRow label="Durée estimée" value={selected.estimatedDuration} />
          ) : null}
          {selected.requiredLicenses?.length ? (
            <InfoRow
              label="Licences requises"
              value={selected.requiredLicenses.join(', ')}
            />
          ) : null}
          <InfoRow label="Statut" value={selected.status} />
        </View>

        {/* ── Company card ── */}
        {selected.company ? (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Entreprise</Text>
            <View style={styles.companyHeader}>
              {logoUrl ? (
                <Image
                  source={{ uri: logoUrl }}
                  style={styles.companyLogo}
                />
              ) : (
                <View style={styles.companyLogoFallback}>
                  <Text style={styles.companyLogoFallbackText}>
                    {(selected.company.companyName || '?')[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.companyName}>
                {selected.company.companyName || 'N/A'}
              </Text>
            </View>
            {selected.company.description ? (
              <Text style={styles.companyDescription}>
                {selected.company.description}
              </Text>
            ) : null}
            {selected.company.legalInfo ? (
              <Text style={styles.companyLegal}>{selected.company.legalInfo}</Text>
            ) : null}
          </View>
        ) : null}

        {/* ── Motivation ── */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Message de motivation</Text>
          <Text style={styles.motivationHint}>
            Expliquez pourquoi vous êtes le bon chauffeur pour cette mission.
          </Text>
          <TextInput
            value={motivationMessage}
            onChangeText={setMotivationMessage}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Votre message…"
            placeholderTextColor="rgba(255,255,255,0.2)"
            multiline
            textAlignVertical="top"
            style={[styles.textInput, focused && styles.textInputFocused]}
          />
        </View>

        {/* ── CTA ── */}
        <Pressable
          onPress={onApply}
          style={({ pressed }) => [styles.applyButton, pressed && styles.applyButtonPressed]}
        >
          <Text style={styles.applyButtonText}>Postuler maintenant</Text>
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
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

  // ── Scroll ────────────────────────────────────────────────────────
  container: {
    padding: 16,
    gap: 14,
  },

  // ── Title block ───────────────────────────────────────────────────
  titleBlock: {
    paddingVertical: 10,
    gap: 8,
  },
  titleLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
    marginTop: 2,
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
  cardHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    marginBottom: 2,
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
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 3,
  },
  routeText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },

  // ── Info rows ─────────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },

  // ── Company ───────────────────────────────────────────────────────
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1C1C1C',
  },
  companyLogoFallback: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogoFallbackText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 18,
    fontWeight: '800',
  },
  companyName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  companyDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 19,
  },
  companyLegal: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    letterSpacing: 0.3,
  },

  // ── Motivation ────────────────────────────────────────────────────
  motivationHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 18,
    marginTop: -4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 100,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: '#0F0F0F',
  },
  textInputFocused: {
    borderColor: 'rgba(255,255,255,0.4)',
  },

  // ── Apply button ──────────────────────────────────────────────────
  applyButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  applyButtonPressed: {
    backgroundColor: '#E5E5E5',
    transform: [{ scale: 0.97 }],
  },
  applyButtonText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});