import { useState } from "react";
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
import { authService } from "@/services/auth.service";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setMessage(null);
    try {
      await authService.forgotPassword(email.trim());
      setMessage("Si l’adresse existe, un lien a été envoyé.");
    } catch {
      setMessage("La requête a échoué. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>RÉCUPÉRATION</Text>
          <Text style={styles.headerTitle}>Mot de passe{"\n"}oublié ?</Text>
          <Text style={styles.headerSubtitle}>
            Entrez votre email pour recevoir un lien de réinitialisation
            sécurisé.
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

          {message && (
            <View style={styles.infoBadge}>
              <Text style={styles.infoText}>{message}</Text>
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
              <Text style={styles.primaryButtonText}>Envoyer le lien</Text>
            )}
          </Pressable>
        </View>

        {/* Back Link */}
        <Pressable onPress={() => router.back()} style={styles.footer}>
          <Text style={styles.footerLink}>Retour à la connexion</Text>
        </Pressable>
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
  infoBadge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoText: {
    color: "rgba(255,255,255,0.6)",
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
    marginTop: 32,
    alignItems: "center",
  },
  footerLink: {
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
