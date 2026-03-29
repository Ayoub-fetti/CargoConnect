import { ActivityIndicator, Pressable, Text, View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { auth, logout } = useAuth();

  const onLogout = async () => {
    await logout();
  };

  const isLoading = auth.status === 'loading';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>SYSTÈME</Text>
        <Text style={styles.headerTitle}>Réglages</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionDescription}>
          Gérez votre session et les paramètres de votre application.
        </Text>

        {/* Logout Card */}
        <View style={styles.card}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>SESSION ACTUELLE</Text>
            <Text style={styles.cardValue}>{auth.user?.email || 'Utilisateur'}</Text>
          </View>
          
          <Pressable
            onPress={onLogout}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.logoutButton,
              { opacity: isLoading || pressed ? 0.8 : 1 }
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#EF4444" size="small" />
            ) : (
              <Text style={styles.logoutButtonText}>Déconnexion</Text>
            )}
          </Pressable>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>VERSION 1.0.4 (BETA)</Text>
          <View style={styles.separator} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
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
  content: {
    padding: 16,
    gap: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 20,
    paddingHorizontal: 4,
  },
  // ── Card Style ──────────────────────────────────────────────────
  card: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.25)',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // ── Logout Button (Text Style) ──────────────────────────────────
  logoutButton: {
    backgroundColor: 'rgba(239,68,68,0.1)', // Subtle red tint
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 13,
  },
  // ── Footer ──────────────────────────────────────────────────────
  footer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.15)',
  },
  separator: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});