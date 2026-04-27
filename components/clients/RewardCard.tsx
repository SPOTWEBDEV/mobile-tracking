// components/RewardCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { createStyles } from '../../styles/theme';

export default function RewardCard({ title, amount, theme , icon }: { title: string; amount: string; theme: 'light' | 'dark' , icon: any}) {
  const styles = createStyles(theme);
  return (
    <View style={[styles.rewardCard, { marginRight: 12 , gap: 10}]}>
      <Ionicons name={icon} size={20} color={'#E6EEF8'} />
      <Text style={{ color: '#E6EEF8'}}>{title}</Text>
      <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{amount}</Text>
    </View>
  );
}
