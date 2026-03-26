import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { API_BASE_URL } from '@/constants/config';

export default function SettingsScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  function confirmSignOut() {
    Alert.alert('Sign out', 'You will need to sign in again to use the app.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logout());
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-slate-950"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <Text className="text-2xl font-bold text-slate-900 dark:text-white">Settings</Text>
      <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Signed in as {user?.email}
      </Text>

      <View className="mt-8 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <View className="border-b border-slate-100 px-4 py-4 dark:border-slate-800">
          <Text className="text-xs font-semibold uppercase text-slate-500">Environment</Text>
          <Text
            className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300"
            selectable
          >
            {API_BASE_URL}
          </Text>
        </View>
        <View className="px-4 py-4">
          <Text className="text-xs font-semibold uppercase text-slate-500">App</Text>
          <Text className="mt-1 text-slate-800 dark:text-slate-200">
            Version {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
        </View>
      </View>

      <Text className="mt-8 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Account
      </Text>
      <Button title="Sign out" variant="danger" onPress={confirmSignOut} className="mt-3" />

      <Pressable
        onPress={() => router.push('/(tabs)/profile')}
        className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 active:opacity-90 dark:border-slate-800 dark:bg-slate-900"
      >
        <Text className="font-semibold text-slate-900 dark:text-white">Edit profile</Text>
        <Text className="mt-1 text-sm text-slate-500">Name, phone, availability</Text>
      </Pressable>
    </ScrollView>
  );
}
