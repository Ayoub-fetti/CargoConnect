import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { auth, isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const result = await login({ email: email.trim(), password });
    if (result.meta.requestStatus === "rejected") {
      const message =
        (result.payload as string | undefined) || "Échec de la connexion";
      setError(message);
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>BIENVENUE</Text>
          <Text style={styles.headerTitle}>Connexion{"\n"}Chauffeur</Text>
          <Text style={styles.headerSubtitle}>
            Accédez à votre tableau de bord et vos missions en cours.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ADRESSE EMAIL</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemple.com"
              placeholderTextColor="rgba(255,255,255,0.2)"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>MOT DE PASSE</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.2)"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {error && (
            <View style={styles.errorBadge}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            onPress={onSubmit}
            disabled={auth.status === "loading"}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: auth.status === "loading" || pressed ? 0.9 : 1 },
            ]}
          >
            {auth.status === "loading" ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.primaryButtonText}>Se connecter</Text>
            )}
          </Pressable>
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.footerLink}>S`enregistrer</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
  },
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
    lineHeight: 44,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.4)",
    marginTop: 12,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#141414",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.25)",
  },
  input: {
    backgroundColor: "#0A0A0A",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  errorBadge: {
    backgroundColor: "rgba(239,68,68,0.1)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#000000",
    fontWeight: "800",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
  },
  footerText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 14,
  },
  footerLink: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
