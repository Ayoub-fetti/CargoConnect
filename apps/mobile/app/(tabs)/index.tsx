import { Pressable, ScrollView, Text, View, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function DriverDashboardScreen() {
  const { auth } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Hero Header — dark cinematic overlay like the web component */}
      <ImageBackground
        source={require('../../assets/images/man-truck.webp')}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        {/* Dark overlay matching brightness(0.25) effect */}
        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>
          <Text style={styles.heroLabel}>Tableau de bord</Text>
          <Text style={styles.heroTitle}>
            Le fret,{'\n'}sans friction.
          </Text>
          <Text style={styles.heroSubtitle}>
            Bienvenue, {auth.user?.email}
          </Text>
        </View>
      </ImageBackground>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Votre espace</Text>

        {/* Missions Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>MISSIONS</Text>
          </View>
          <Text style={styles.cardTitle}>Missions disponibles</Text>
          <Text style={styles.cardDescription}>
            Parcourez les missions ouvertes et postulez rapidement.
          </Text>
          <Link href="/(tabs)/missions" asChild>
            <Pressable
              style={({ pressed }) => [styles.buttonPrimary, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonPrimaryText}>Voir les missions</Text>
            </Pressable>
          </Link>
        </View>

        {/* Applications Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>CANDIDATURES</Text>
          </View>
          <Text style={styles.cardTitle}>Mes candidatures</Text>
          <Text style={styles.cardDescription}>
            Suivez toutes vos candidatures aux missions.
          </Text>
          <Link href="/(tabs)/applications" asChild>
            <Pressable
              style={({ pressed }) => [styles.buttonOutline, pressed && styles.buttonOutlinePressed]}
            >
              <Text style={styles.buttonOutlineText}>Voir mes candidatures</Text>
            </Pressable>
          </Link>
        </View>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>PROFIL</Text>
          </View>
          <Text style={styles.cardTitle}>Profil & Documents</Text>
          <Text style={styles.cardDescription}>
            Mettez à jour votre profil, avatar et documents.
          </Text>
          <Link href="/(tabs)/profile" asChild>
            <Pressable
              style={({ pressed }) => [styles.buttonOutline, pressed && styles.buttonOutlinePressed]}
            >
              <Text style={styles.buttonOutlineText}>Gérer mon profil</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  // ── Hero ──────────────────────────────────────────────────────────
  heroBackground: {
    width: '100%',
    height: 260,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    // Mimics brightness(0.25) — very dark overlay
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
  },
  heroContent: {
    padding: 24,
    paddingBottom: 28,
    gap: 6,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 46,
    letterSpacing: -1,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },

  // ── Scroll / Container ────────────────────────────────────────────
  scrollView: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  container: {
    padding: 20,
    paddingTop: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    marginBottom: 20,
  },

  // ── Cards ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#141414',
    borderRadius: 20,
    padding: 22,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: 8,
  },
  cardHeader: {
    marginBottom: 2,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 20,
  },

  // ── Buttons ───────────────────────────────────────────────────────
  buttonPrimary: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#E5E5E5',
    transform: [{ scale: 0.97 }],
  },
  buttonPrimaryText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  buttonOutline: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonOutlinePressed: {
    borderColor: 'rgba(255,255,255,0.7)',
    transform: [{ scale: 0.97 }],
  },
  buttonOutlineText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },

  bottomSpacer: {
    height: 20,
  },
});