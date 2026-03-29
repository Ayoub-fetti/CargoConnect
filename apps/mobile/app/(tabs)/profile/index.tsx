import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { CONFIG } from "@/constants/config";
import { driverService } from "@/services/driver.service";

type ProfileData = {
  _id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  licenseTypes?: string[];
  zone?: string[];
  isAvailable?: boolean;
};

type DriverDocument = {
  _id: string;
  originalName: string;
  type: string;
  createdAt: string;
};

// const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [documents, setDocuments] = useState<DriverDocument[]>([]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseTypes, setLicenseTypes] = useState("");
  const [zone, setZone] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [documentType, setDocumentType] = useState("OTHER");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, docs] = await Promise.all([
        driverService.getProfile(),
        driverService.getDocuments(),
      ]);
      setProfile(profileData);
      setDocuments(docs || []);
      setFullName(profileData.fullName || "");
      setPhone(profileData.phone || "");
      setLicenseTypes((profileData.licenseTypes || []).join(", "));
      setZone((profileData.zone || []).join(", "));
      setIsAvailable(profileData.isAvailable ?? true);
    } catch {
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSaveProfile = async () => {
    setSaving(true);
    try {
      await driverService.updateProfile({
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
        isAvailable,
      });
      Alert.alert("Succès", "Profil mis à jour.");
      await loadData();
    } catch {
      Alert.alert("Erreur", "Échec de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  const onUploadAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (picked.canceled) return;
    const asset = picked.assets[0];
    setUploading(true);
    try {
      await driverService.uploadAvatar({
        fileUri: asset.uri,
        fileName: asset.fileName || "avatar.jpg",
        mimeType: asset.mimeType || "image/jpeg",
        webFile: (asset as any).file,
      });
      await loadData();
    } finally {
      setUploading(false);
    }
  };

  const onUploadDocument = async () => {
    const picked = await DocumentPicker.getDocumentAsync({
      multiple: false,
      type: ["application/pdf", "image/*"],
    });

    if (picked.canceled) return;
    const asset = picked.assets[0];
    setUploading(true);
    try {
      await driverService.uploadDocument({
        fileUri: asset.uri,
        fileName: asset.name,
        mimeType: asset.mimeType || "application/octet-stream",
        webFile: (asset as any).file,
        type: documentType.trim().toUpperCase() || "OTHER",
      });
      await loadData();
    } catch {
      Alert.alert("Erreur", "Échec de l’envoi.");
    } finally {
      setUploading(false);
    }
  };

  const avatarUrl =
    profile?.avatar && profile.avatar.startsWith("uploads")
      ? `${CONFIG.API_BASE_URL.replace("/api", "")}/${profile.avatar}`
      : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>COMPTE</Text>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <Text style={styles.headerEmail}>{profile?.email}</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.section}>
          <View style={styles.avatarRow}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {(profile?.fullName || "D")[0]}
                </Text>
              </View>
            )}
            <Pressable onPress={onUploadAvatar} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                {uploading ? "Chargement..." : "Changer la photo"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>NOM COMPLET</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholderTextColor="rgba(255,255,255,0.2)"
          />

          <Text style={styles.inputLabel}>TÉLÉPHONE</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholderTextColor="rgba(255,255,255,0.2)"
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Disponible pour missions</Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: "#262626", true: "#22C55E" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Pressable
          onPress={onSaveProfile}
          disabled={saving}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Text>
        </Pressable>

        {/* Documents Section */}
        <View style={[styles.header, { borderBottomWidth: 0, marginTop: 20 }]}>
          <Text style={styles.headerLabel}>DOCUMENTS</Text>
          <Text style={[styles.headerTitle, { fontSize: 24 }]}>
            Mes Justificatifs
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.inputLabel}>TYPE DE DOCUMENT</Text>
          <TextInput
            value={documentType}
            onChangeText={setDocumentType}
            style={styles.input}
            placeholder="Ex: CV, Permis..."
            placeholderTextColor="rgba(255,255,255,0.2)"
          />
          <Pressable
            onPress={onUploadDocument}
            style={styles.secondaryButton}
            disabled={uploading}
          >
            <Text style={styles.secondaryButtonText}>Ajouter un document</Text>
          </Pressable>

          <FlatList
            data={documents}
            scrollEnabled={false}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.docItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName}>{item.originalName}</Text>
                  <Text style={styles.docType}>{item.type}</Text>
                </View>
                <Pressable
                  onPress={() =>
                    driverService.deleteDocument(item._id).then(loadData)
                  }
                >
                  <Text style={styles.deleteText}>Supprimer</Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Aucun document importé.</Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0A0A0A" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { paddingBottom: 40 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.3)",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.8,
  },
  headerEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    marginTop: 4,
  },

  section: { paddingHorizontal: 20, marginTop: 20 },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#141414",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: { color: "#FFFFFF", fontSize: 24, fontWeight: "800" },

  card: {
    backgroundColor: "#141414",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    gap: 12,
  },

  inputLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.3)",
    marginBottom: -4,
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

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  switchText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    fontWeight: "500",
  },

  primaryButton: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryButtonText: { color: "#000000", fontWeight: "800", fontSize: 15 },

  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  secondaryButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },

  docItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  docName: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  docType: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 },
  deleteText: { color: "#EF4444", fontWeight: "700", fontSize: 12 },
  separator: { height: 1, backgroundColor: "rgba(255,255,255,0.05)" },
  emptyText: {
    color: "rgba(255,255,255,0.2)",
    textAlign: "center",
    marginTop: 10,
  },
});
