import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
	const router = useRouter();
	const { auth, isAuthenticated, login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (isAuthenticated) {
			router.replace('/(tabs)');
		}
	}, [isAuthenticated, router]);

	const onSubmit = async () => {
		setError(null);
		if (!email || !password) {
			setError('Please fill in email and password.');
			return;
		}

		const result = await login({ email: email.trim(), password });
		if (result.meta.requestStatus === 'rejected') {
			const message =
				(result.payload as string | undefined) ||
				(result.error?.message ?? 'Login failed');
			setError(message);
			return;
		}

		router.replace('/(tabs)');
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
				<Text style={{ fontSize: 30, fontWeight: '700', marginBottom: 8 }}>Driver Login</Text>
				<Text style={{ color: '#6B7280', marginBottom: 24 }}>
					Login to access your dashboard and missions.
				</Text>

				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder="Email"
					keyboardType="email-address"
					autoCapitalize="none"
					style={{
						borderWidth: 1,
						borderColor: '#D1D5DB',
						borderRadius: 10,
						paddingHorizontal: 12,
						paddingVertical: 12,
						marginBottom: 12,
					}}
				/>
				<TextInput
					value={password}
					onChangeText={setPassword}
					placeholder="Password"
					secureTextEntry
					style={{
						borderWidth: 1,
						borderColor: '#D1D5DB',
						borderRadius: 10,
						paddingHorizontal: 12,
						paddingVertical: 12,
					}}
				/>

				{error ? (
					<Text style={{ color: '#DC2626', marginTop: 12 }}>{error}</Text>
				) : null}

				<Pressable
					onPress={onSubmit}
					disabled={auth.status === 'loading'}
					style={{
						marginTop: 16,
						backgroundColor: '#111827',
						borderRadius: 10,
						paddingVertical: 14,
						alignItems: 'center',
						opacity: auth.status === 'loading' ? 0.7 : 1,
					}}
				>
					{auth.status === 'loading' ? (
						<ActivityIndicator color="#FFFFFF" />
					) : (
						<Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Login</Text>
					)}
				</Pressable>

				<View style={{ marginTop: 18, flexDirection: 'row', gap: 6 }}>
					<Text style={{ color: '#6B7280' }}>No account?</Text>
					<Link href="/(auth)/register" style={{ color: '#111827', fontWeight: '700' }}>
						Register
					</Link>
				</View>
			</View>
		</SafeAreaView>
	);
}
