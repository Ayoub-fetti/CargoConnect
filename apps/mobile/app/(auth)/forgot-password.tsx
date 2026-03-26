import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAppDispatch } from '@/store/hooks';
import { forgotPassword } from '@/store/slices/authSlice';
import { isValidEmail } from '@/utils/validation';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit() {
    setError(null);
    if (!isValidEmail(email)) {
      setError('Enter a valid email.');
      return;
    }
    setLoading(true);
    try {
      await dispatch(forgotPassword(email.trim())).unwrap();
      setDone(true);
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Request failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll className="bg-slate-50 dark:bg-slate-950">
      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Link href="/(auth)/login" asChild>
          <Pressable className="mb-8 self-start">
            <Text className="text-brand-700 dark:text-brand-400">← Back to sign in</Text>
          </Pressable>
        </Link>

        <Text className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Reset password</Text>
        <Text className="mb-8 text-slate-500 dark:text-slate-400">
          If an account exists for this email, you will receive reset instructions.
        </Text>

        {done ? (
          <View className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950">
            <Text className="text-center text-emerald-800 dark:text-emerald-200">
              Check your inbox for the next steps.
            </Text>
          </View>
        ) : (
          <>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error ? <Text className="mb-4 text-sm text-red-600">{error}</Text> : null}
            <Button title="Send reset link" onPress={onSubmit} loading={loading} />
          </>
        )}
      </View>
    </Screen>
  );
}
