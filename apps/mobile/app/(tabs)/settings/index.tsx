import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
	const { auth, logout } = useAuth();

	const onLogout = async () => {
		await logout();
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<View style={{ padding: 16, gap: 10 }}>
				<Text style={{ fontSize: 24, fontWeight: '700' }}>Settings</Text>
				<Text style={{ color: '#6B7280' }}>Manage your session</Text>

				<Pressable
					onPress={onLogout}
					disabled={auth.status === 'loading'}
					style={{
						marginTop: 10,
						backgroundColor: '#DC2626',
						borderRadius: 10,
						paddingVertical: 14,
						alignItems: 'center',
						opacity: auth.status === 'loading' ? 0.7 : 1,
					}}
				>
					{auth.status === 'loading' ? (
						<ActivityIndicator color="#FFFFFF" />
					) : (
						<Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Logout</Text>
					)}
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
