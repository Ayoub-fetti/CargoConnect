import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordScreen() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const onSubmit = async () => {
		if (!email) return;
		setLoading(true);
		setMessage(null);
		try {
			await authService.forgotPassword(email.trim());
			setMessage('If your email exists, a reset link was sent.');
		} catch {
			setMessage('Request failed. Try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
			<View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
				<Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 10 }}>Forgot Password</Text>
				<Text style={{ color: '#6B7280', marginBottom: 20 }}>
					Enter your email to receive a reset link.
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

				<Pressable
					onPress={onSubmit}
					disabled={loading}
					style={{
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
						<Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Send reset link</Text>
					)}
				</Pressable>

				{message ? <Text style={{ marginTop: 12, color: '#374151' }}>{message}</Text> : null}
			</View>
		</SafeAreaView>
	);
}
