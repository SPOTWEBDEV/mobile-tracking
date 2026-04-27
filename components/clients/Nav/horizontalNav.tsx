import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../hooks/theme';

const horizontalNav = () => {
    const { colors } = useAppTheme(); // get the theme colors
  return (
     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Image
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
          source={require('../../../assets/images/avatar.png')}
        />

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 9999,
          }}
        >
          <Text style={{ marginRight: 8 }}>🇳🇬</Text>
          <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.text }}>
            Nigerian Naira
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.icon} />
        </TouchableOpacity>

        <Ionicons name="notifications-outline" size={22} color={colors.icon} />
      </View>
  )
}

export default horizontalNav