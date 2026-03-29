import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { authService } from "@/services/auth.service";
import { SafeAreaView } from "react-native-safe-area-context";

type Status = "loading" | "success" | "error";

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!token) {
        if (mounted) setStatus("error");
        return;
      }

      try {
        await authService.verifyEmail(token);
        if (!mounted) return;
        setStatus("success");
        setTimeout(() => router.replace("/(auth)/login"), 2500);
      } catch {
        if (mounted) setStatus("error");
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [token, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {status === "loading" && (
          <View style={styles.centerBlock}>
            <ActivityIndicator color="#FFFFFF" size="large" />
            <Text style={styles.statusLabel}>SYSTÈME</Text>
            <Text style={styles.title}>Vérification...</Text>
            <Text style={styles.subtitle}>
              Nous validons votre adresse email avec nos serveurs.
            </Text>
          </View>
        )}

        {status === "success" && (
          <View style={styles.centerBlock}>
            <View style={[styles.statusIcon, styles.successBg]}>
              <Text style={styles.successText}>✓</Text>
            </View>
            <Text style={styles.statusLabel}>CONFIRMÉ</Text>
            <Text style={styles.title}>Email Vérifié</Text>
            <Text style={styles.subtitle}>
              Compte activé avec succès. Redirection vers la page de
              connexion...
            </Text>
          </View>
        )}

        {status === "error" && (
          <View style={styles.centerBlock}>
            <View style={[styles.statusIcon, styles.errorBg]}>
              <Text style={styles.errorText}>✕</Text>
            </View>
            <Text style={styles.statusLabel}>ERREUR</Text>
            <Text style={styles.title}>Lien Invalide</Text>
            <Text style={styles.subtitle}>
              Ce lien de vérification a expiré ou n`est plus valide.
            </Text>
            <Text
              style={styles.backLink}
              onPress={() => router.replace("/(auth)/login")}
            >
              Retour à la connexion
            </Text>
          </View>
        )}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  centerBlock: {
    alignItems: "center",
    width: "100%",
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.3)",
    marginTop: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    maxWidth: 280,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  successBg: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  errorBg: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  successText: {
    color: "#22C55E",
    fontSize: 28,
    fontWeight: "800",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 28,
    fontWeight: "800",
  },
  backLink: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 32,
    textDecorationLine: "underline",
  },
});
