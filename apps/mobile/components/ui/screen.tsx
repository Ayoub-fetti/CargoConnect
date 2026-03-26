import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
  contentClassName?: string;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
};

export function Screen({
  children,
  scroll = true,
  refreshing = false,
  onRefresh,
  className = '',
  contentClassName = '',
  edges = ['top', 'left', 'right'],
}: Props) {
  const refresh =
    onRefresh !== undefined ? (
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0d9488" />
    ) : undefined;

  const body = scroll ? (
    <ScrollView
      className={`flex-1 ${contentClassName}`}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={refresh}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${contentClassName}`}>{children}</View>
  );

  return (
    <SafeAreaView className={`flex-1 bg-slate-50 dark:bg-slate-950 ${className}`} edges={edges}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
