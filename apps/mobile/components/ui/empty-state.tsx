import type React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  title: string;
  description?: string;
  /** MaterialIcons icon name */
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
};

export function EmptyState({ title, description, icon = 'inbox' }: Props) {
  return (
    <View className="items-center justify-center px-8 py-16">
      <MaterialIcons name={icon} size={48} color="#94a3b8" />
      <Text className="mt-4 text-center text-lg font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </Text>
      {description ? (
        <Text className="mt-2 text-center text-slate-500 dark:text-slate-400">{description}</Text>
      ) : null}
    </View>
  );
}
