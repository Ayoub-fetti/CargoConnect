import { Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  multiline,
}: Props) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-xl border bg-white px-4 text-base text-slate-900 dark:bg-slate-900 dark:text-slate-100 ${
          error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
        } ${multiline ? 'min-h-[100px] py-3' : 'py-3.5'}`}
      />
      {error ? <Text className="mt-1 text-sm text-red-600">{error}</Text> : null}
    </View>
  );
}
