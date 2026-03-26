import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 active:bg-brand-700 dark:bg-brand-500',
  secondary: 'bg-slate-200 dark:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600',
  ghost: 'bg-transparent active:bg-slate-100 dark:active:bg-slate-800',
  danger: 'bg-red-600 active:bg-red-700',
};

const textVariants: Record<Variant, string> = {
  primary: 'text-white font-semibold',
  secondary: 'text-slate-900 dark:text-white font-semibold',
  ghost: 'text-brand-700 dark:text-brand-400 font-semibold',
  danger: 'text-white font-semibold',
};

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
};

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-2xl px-5 py-3.5 items-center justify-center ${variants[variant]} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#0f172a' : '#fff'} />
      ) : (
        <Text className={`text-base ${textVariants[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
