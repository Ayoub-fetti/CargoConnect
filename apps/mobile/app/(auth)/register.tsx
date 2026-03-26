import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterScreen() {
	const router = useRouter();
	const { registerDriver } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');
	const [licenseTypes, setLicenseTypes] = useState('');
	const [zone, setZone] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const onSubmit = async () => {
		setError(null);
		setSuccess(null);

		if (!email || !password || !fullName || !phone) {
			setError('Please fill all required fields.');
			return;
		}

		setLoading(true);
		const result = await registerDriver({
			email: email.trim(),
			password,
			fullName: fullName.trim(),
			phone: phone.trim(),
			licenseTypes: licenseTypes
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean),
			zone: zone
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean),
		});
		setLoading(false);

		if (result.meta.requestStatus === 'rejected') {
			const message =
				(result.payload as string | undefined) ||
				(result.error?.message ?? 'Registration failed');
			setError(message);
			return;
		}

		setSuccess('Registration successful. Please verify your email, then login.');
		setTimeout(() => router.replace('/(auth)/login'), 1400);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
				<Text style={{ fontSize: 30, fontWeight: '700', marginBottom: 8 }}>Driver Register</Text>
				<Text style={{ color: '#6B7280', marginBottom: 24 }}>
					Create your account and verify your email to continue.
				</Text>

				<TextInput
					value={fullName}
					onChangeText={setFullName}
					placeholder="Full name"
					style={inputStyle}
				/>
				<TextInput value={phone} onChangeText={setPhone} placeholder="Phone" style={inputStyle} />
				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder="Email"
					keyboardType="email-address"
					autoCapitalize="none"
					style={inputStyle}
				/>
				<TextInput
					value={password}
					onChangeText={setPassword}
					placeholder="Password (min 8 chars)"
					secureTextEntry
					style={inputStyle}
				/>
				<TextInput
					value={licenseTypes}
					onChangeText={setLicenseTypes}
					placeholder="License types (comma separated)"
					style={inputStyle}
				/>
				<TextInput
					value={zone}
					onChangeText={setZone}
					placeholder="Zones (comma separated)"
					style={inputStyle}
				/>

				{error ? <Text style={{ color: '#DC2626' }}>{error}</Text> : null}
				{success ? <Text style={{ color: '#15803D' }}>{success}</Text> : null}

				<Pressable
					onPress={onSubmit}
					disabled={loading}
					style={{
						marginTop: 12,
						backgroundColor: '#111827',
						borderRadius: 10,
						paddingVertical: 14,
						alignItems: 'center',
						opacity: loading ? 0.7 : 1,
					}}
				>
					{loading ? (
						<ActivityIndicator color="#FFFFFF" />
					) : (
						<Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Create Account</Text>
					)}
				</Pressable>

				<View style={{ marginTop: 18, flexDirection: 'row', gap: 6 }}>
					<Text style={{ color: '#6B7280' }}>Already have an account?</Text>
					<Link href="/(auth)/login" style={{ color: '#111827', fontWeight: '700' }}>
						Login
					</Link>
				</View>
			</View>
		</SafeAreaView>
	);
}

const inputStyle = {
	borderWidth: 1,
	borderColor: '#D1D5DB',
	borderRadius: 10,
	paddingHorizontal: 12,
	paddingVertical: 12,
	marginBottom: 10,
} as const;
