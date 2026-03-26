import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { isValidEmail } from '@/utils/validation';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLocalError(null);
    clearError();
    if (!isValidEmail(email)) {
      setLocalError('Enter a valid email address.');
      return;
    }
    if (password.length < 1) {
      setLocalError('Password is required.');
      return;
    }
    setLoading(true);
    try {
      await dispatch(login({ email: email.trim(), password })).unwrap();
      router.replace('/(tabs)/missions');
    } catch (e) {
      setLocalError(typeof e === 'string' ? e : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  const err = localError;

  return (
    <Screen scroll className="bg-slate-50 dark:bg-slate-950" edges={['top', 'left', 'right']}>
      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <View className="mb-10 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-brand-600">
            <Text className="text-2xl font-black text-white">CC</Text>
          </View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">CargoConnect</Text>
          <Text className="mt-1 text-center text-slate-500 dark:text-slate-400">
            Sign in to find missions and manage applications
          </Text>
        </View>

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={undefined}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        {err ? <Text className="mb-4 text-center text-sm text-red-600">{err}</Text> : null}

        <Button title="Sign in" onPress={onSubmit} loading={loading} className="mt-2" />

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable className="mt-6">
            <Text className="text-center text-sm text-brand-700 dark:text-brand-400">
              Forgot password?
            </Text>
          </Pressable>
        </Link>

        <View className="mt-8 flex-row flex-wrap items-center justify-center">
          <Text className="text-slate-600 dark:text-slate-400">No account? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="font-semibold text-brand-700 dark:text-brand-400">Register as driver</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
