import { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
};

export function Card({ children, onPress, className = '' }: Props) {
  const cn = `rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`;
  if (onPress) {
    return (
      <Pressable onPress={onPress} className={`active:opacity-90 ${cn}`}>
        {children}
      </Pressable>
    );
  }
  return <View className={cn}>{children}</View>;
}
