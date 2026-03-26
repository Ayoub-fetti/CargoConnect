import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { authService } from '@/services/auth.service';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!token) {
        if (mounted) setStatus('error');
        return;
      }

      try {
        await authService.verifyEmail(token);
        if (!mounted) return;
        setStatus('success');
        setTimeout(() => router.replace('/(auth)/login'), 2000);
      } catch {
        if (mounted) setStatus('error');
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [token, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      {status === 'loading' && (
        <>
          <ActivityIndicator />
          <Text style={{ marginTop: 12 }}>Verification in progress...</Text>
        </>
      )}
      {status === 'success' && (
        <Text>Email verified successfully. Redirecting to login...</Text>
      )}
      {status === 'error' && (
        <Text>Invalid or expired verification link.</Text>
      )}
    </View>
  );
}