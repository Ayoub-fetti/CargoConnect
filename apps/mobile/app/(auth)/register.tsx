import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAppDispatch } from '@/store/hooks';
import { registerDriver } from '@/store/slices/authSlice';
import { isValidEmail, minLength } from '@/utils/validation';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setSuccess(null);
    if (!minLength(fullName, 2)) {
      setError('Enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email.');
      return;
    }
    if (!minLength(password, 8)) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!minLength(phone, 6)) {
      setError('Enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      const res = await dispatch(
        registerDriver({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          phone: phone.trim(),
        }),
      ).unwrap();
      setSuccess(res.message);
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll className="bg-slate-50 dark:bg-slate-950">
      <View className="px-6 pt-4" style={{ paddingBottom: insets.bottom + 24 }}>
        <Link href="/(auth)/login" asChild>
          <Pressable className="mb-6 self-start">
            <Text className="text-brand-700 dark:text-brand-400">← Back to sign in</Text>
          </Pressable>
        </Link>

        <Text className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Create driver account</Text>
        <Text className="mb-8 text-slate-500 dark:text-slate-400">
          We will send a link to verify your email before you can sign in.
        </Text>

        <TextField label="Full name" value={fullName} onChangeText={setFullName} placeholder="Jane Driver" />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextField
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 …"
          keyboardType="phone-pad"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          secureTextEntry
          autoCapitalize="none"
        />

        {error ? <Text className="mb-4 text-center text-sm text-red-600">{error}</Text> : null}
        {success ? (
          <View className="mb-4 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950">
            <Text className="text-center text-sm text-emerald-800 dark:text-emerald-200">{success}</Text>
            <Button
              title="Go to sign in"
              variant="secondary"
              onPress={() => router.replace('/(auth)/login')}
              className="mt-4"
            />
          </View>
        ) : (
          <Button title="Register" onPress={onSubmit} loading={loading} className="mt-2" />
        )}
      </View>
    </Screen>
  );
}
