import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const { registerDriver } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseTypes, setLicenseTypes] = useState("");
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!email || !password || !fullName || !phone) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    const result = await registerDriver({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phone: phone.trim(),
      licenseTypes: licenseTypes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      zone: zone
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
    setLoading(false);

    if (result.meta.requestStatus === "rejected") {
      const message =
        (result.payload as string | undefined) || "Échec de l’inscription";
      setError(message);
      return;
    }

    setSuccess("Inscription réussie. Vérifiez vos emails.");
    setTimeout(() => router.replace("/(auth)/login"), 1400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>NOUVEAU COMPTE</Text>
          <Text style={styles.headerTitle}>Inscription</Text>
          <Text style={styles.headerSubtitle}>
            Créez votre profil et rejoignez notre réseau de chauffeurs.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NOM COMPLET *</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ex: Jean Dupont"
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TÉLÉPHONE *</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+212 ..."
              keyboardType="phone-pad"
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ADRESSE EMAIL *</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>MOT DE PASSE *</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 caractères"
              secureTextEntry
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PERMIS (SÉPARÉS PAR VIRGULE)</Text>
            <TextInput
              value={licenseTypes}
              onChangeText={setLicenseTypes}
              placeholder="Ex: B, C, E"
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ZONES D'OPÉRATION</Text>
            <TextInput
              value={zone}
              onChangeText={setZone}
              placeholder="Ex: Casablanca, Rabat"
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={styles.input}
            />
          </View>

          {error && (
            <View style={[styles.statusBadge, styles.errorBadge]}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={[styles.statusBadge, styles.successBadge]}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          <Pressable
            onPress={onSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: loading || pressed ? 0.9 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.primaryButtonText}>Créer mon compte</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà inscrit ?</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Se connecter</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0A0A0A" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },

  header: { marginBottom: 28, paddingHorizontal: 4 },
  headerLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.3)",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    marginTop: 8,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#141414",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 16,
  },
  inputGroup: { gap: 6 },
  inputLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.25)",
  },
  input: {
    backgroundColor: "#0A0A0A",
    borderRadius: 12,
    padding: 14,
    color: "#FFFFFF",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  statusBadge: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  errorBadge: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderColor: "rgba(239,68,68,0.2)",
  },
  successBadge: {
    backgroundColor: "rgba(34,197,94,0.1)",
    borderColor: "rgba(34,197,94,0.2)",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  successText: {
    color: "#22C55E",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  primaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: { color: "#000000", fontWeight: "800", fontSize: 16 },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
  },
  footerText: { color: "rgba(255,255,255,0.3)", fontSize: 14 },
  footerLink: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
});
