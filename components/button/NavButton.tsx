// components/NavButton.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { createStyles } from '../../styles/theme';

type NavButtonProps = {
  title: string;
  url: Parameters<ReturnType<typeof useRouter>['push']>[0] | '';
  theme: 'light' | 'dark';
};

export default function NavButton({ title, url, theme }: NavButtonProps) {
  const router = useRouter();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.accountCard, { paddingVertical: 10, paddingHorizontal: 12, marginRight: 10 }]}
      onPress={() => router.push(url as any)}
    >
      <Text style={{ color: theme === 'light' ? '#0F172A' : '#E6EEF8', fontWeight: '600' }}>{title}</Text>
    </TouchableOpacity>
  );
}
