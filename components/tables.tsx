import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../hooks/theme'; // ← your theme hook

export const Table = ({
  title,
  amount,
  date,
}: {
  title: string;
  amount: number;
  date: string;
}) => {
  const { isDark, colors } = useAppTheme();
  const isPositive = amount > 0;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#1E2A6D' : '#E5E7EB',
        borderRadius: 8,
      }}
    >
      {/* ICON */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isDark ? '#1E2A6D' : '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 8,
        }}
      >
        <Ionicons
          name={isPositive ? 'arrow-up' : 'arrow-down'}
          size={18}
          color={isPositive ? '#10B981' : '#F87171'}
        />
      </View>

      {/* TITLE + DATE */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: colors.subText,
            fontSize: 12,
            marginTop: 2,
          }}
        >
          {date}
        </Text>
      </View>

      {/* AMOUNT */}
      <Text
        style={{
          color: isPositive ? '#10B981' : '#F87171',
          fontWeight: '700',
          marginRight: 12,
        }}
      >
        {isPositive
          ? `₦${Math.abs(amount).toFixed(2)}`
          : `-₦${Math.abs(amount).toFixed(2)}`}
      </Text>
    </View>
  );
};
