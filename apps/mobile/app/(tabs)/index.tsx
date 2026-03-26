import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function DriverDashboardScreen() {
  const { auth } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: '700' }}>Driver Dashboard</Text>
        <Text style={{ color: '#6B7280' }}>Welcome, {auth.user?.email}</Text>

        <Card title="Missions" description="Browse open missions and apply quickly.">
          <Link href="/(tabs)/missions" asChild>
            <Pressable style={buttonStyle}>
              <Text style={buttonTextStyle}>Open missions</Text>
            </Pressable>
          </Link>
        </Card>

        <Card title="My Applications" description="Track all your mission applications.">
          <Link href="/(tabs)/applications" asChild>
            <Pressable style={buttonStyle}>
              <Text style={buttonTextStyle}>View applications</Text>
            </Pressable>
          </Link>
        </Card>

        <Card title="Profile & Documents" description="Update profile, upload avatar and documents.">
          <Link href="/(tabs)/profile" asChild>
            <Pressable style={buttonStyle}>
              <Text style={buttonTextStyle}>Manage profile</Text>
            </Pressable>
          </Link>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: '#6B7280' }}>{description}</Text>
      {children}
    </View>
  );
}

const buttonStyle = {
  backgroundColor: '#111827',
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: 'center',
} as const;

const buttonTextStyle = {
  color: '#FFFFFF',
  fontWeight: '700',
} as const;
