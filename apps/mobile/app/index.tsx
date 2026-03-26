import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { isAuthenticated, bootstrapDone } = useAuth();

  if (!bootstrapDone) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/missions" />;
  }

  return <Redirect href="/(auth)/login" />;
}
